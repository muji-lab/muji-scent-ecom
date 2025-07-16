'use client';

/* -------------------------------------------------------------------------- */
/* IMPORTS                                                                    */
/* -------------------------------------------------------------------------- */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import slugify from 'slugify';
import Image from 'next/image';
import {
  UploadCloud,
  X as XIcon,
  Trash2,
  GripVertical,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import ImageCropper from './ImageCropper';
import { Hourglass } from 'ldrs/react';
import 'ldrs/react/Hourglass.css';


import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/* Editeur riche en dynamique (évite SSR) */
const RichTextEditor = dynamic(() => import('./RichTextEditor'), { ssr: false });

/* -------------------------------------------------------------------------- */
/* CONST                                                                      */
/* -------------------------------------------------------------------------- */
const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

const getStrapiMediaUrl = (url) => {
  if (!url) return null;
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
};

async function uploadToStrapi(file) {
  const fd = new FormData();
  fd.append('files', file);
  const res = await fetch('/api/strapi/upload', { method: 'POST', body: fd });
  if (!res.ok) throw new Error('Upload échoué');
  return res.json(); // [{ id, url, ... }]
}

function generateCustomProductId() {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const randomPart = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `PROD-${year}${month}${day}-${randomPart}`;
}

/* -------------------------------------------------------------------------- */
/* COMPONENT: ProductForm                                                     */
/* -------------------------------------------------------------------------- */
export default function ProductForm({ initial }) {
  const router  = useRouter();
  const isEdit  = Boolean(initial);

  /* ------------------------- états principaux --------------------------- */
  const [title, setTitle]   = useState(initial?.title ?? '');
  const [slug, setSlug]     = useState(initial?.slug  ?? '');
  const [desc, setDesc]     = useState(initial?.description ?? '');
  const [variants, setVars] = useState(
    initial?.variants?.map((v) => ({ ...v, images: v.images || [] })) ?? []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ----- état cropper : null ou { src, mime, cb } ----------------------- */
  const [cropping, setCropping] = useState(null);
  const [isUploading, setIsUploading] = useState(false);


  /* ----------------------------- SUBMIT --------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (variants.length === 0) {
      alert('Vous devez ajouter au moins une variante.');
      return;
    }

    setIsSubmitting(true);

    const totalStock = variants.reduce(
      (sum, v) => sum + Number(v.stock || 0),
      0
    );

    const payload = {
      title,
      slug: slug || slugify(title, { lower: true }),
      customProductId: initial?.customProductId || generateCustomProductId(),
      description: desc,
      variants: variants.map((v) => ({
        label: v.label,
        price: v.price,
        stock: v.stock,
        image: v.images.map((img) => img.id),
      })),
    };

    try {


       const endpoint = '/api/strapi/products';
  const method   = isEdit ? 'PUT' : 'POST';

  const body = isEdit
    ? { documentId: initial.documentId, data: payload }  // <-- ajoute documentId
  : payload;                                           // création inchangée

  const res = await fetch(endpoint, {
    method,
    headers:{ 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
  const err = await res.json().catch(() => ({}));
  console.error('Strapi error payload:', err); // ← visible dans la console
  // alert(err.error?.message || 'Erreur inconnue');
  // return;
}

      router.push('/products');
      router.refresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  
  /* -------------------- sélection fichier (ouvre cropper) --------------- */
const handleFileSelect = (file, callback) => {
  // 1) on affiche immédiatement l'overlay
  setIsProcessingImage(true);

  // 2) on laisse le navigateur peindre puis on lance la (grosse) conversion
  requestAnimationFrame(() => convertAndOpenCropper(file, callback));
};

async function convertAndOpenCropper(file, callback) {
  let fileToUse = file;

  /* -------- conversion HEIC éventuelle -------- */
  const isHEIC =
    file.type === 'image/heic' ||
    file.name.toLowerCase().endsWith('.heic');

  if (isHEIC) {
    try {
      const { default: heic2any } = await import('heic2any');
      const result     = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.95 });
      const outputBlob = Array.isArray(result) ? result[0] : result;
      fileToUse = new File([outputBlob], file.name.replace(/\.heic$/i, '.jpg'), {
        type: 'image/jpeg',
      });
    } catch {
      alert('Erreur conversion HEIC. Merci de choisir une image JPG/PNG.');
      setIsProcessingImage(false);
      return;
    }
  }

  /* -------- FileReader pour afficher la modale -------- */
  const reader = new FileReader();
  reader.onload = () => {
    setIsProcessingImage(false);  // overlay off
    setCropping({
      src : reader.result,
      mime: fileToUse.type,
      cb  : callback,
    });
  };
  reader.readAsDataURL(fileToUse);
}

const [isProcessingImage, setIsProcessingImage] = useState(false);




  /* ---------------------------------------------------------------------- */
  /* RENDER                                                                 */
  /* ---------------------------------------------------------------------- */
  return (
    <>

{isProcessingImage && (
  <div className="fixed inset-0 z-[999] bg-black/60 flex flex-col items-center justify-center space-y-4">
    <Hourglass
      size="40"
      bgOpacity="0.1"
      speed="1.75"
      color="white"
    />
    <span className="text-white text-sm">Traitement de l’image en cours…</span>
  </div>
)}
      {/* ----------------- CROPPER MODAL ----------------- */}
      {cropping && (
        <ImageCropper
          imageSrc={cropping.src}
          mimeType={cropping.mime}
          isUploading={isUploading}
          onCropComplete={async (blob) => {
            setIsUploading(true);
            try {
              const ext      = cropping.mime === 'image/png' ? 'png' : 'jpg';
              const cropped  = new File([blob], `cropped.${ext}`, {
                type: cropping.mime,
              });
              const uploaded = await uploadToStrapi(cropped);
              await cropping.cb(uploaded[0]); // ajoute à la variante
            } catch {
              alert("Erreur lors de l'upload de l'image recadrée.");
            } finally {
              setCropping(null);
              setIsUploading(false);
            }
          }}
          onCancel={() => setCropping(null)}
        />
      )}

      {/* ----------------------- FORM -------------------- */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ----- Infos générales ----- */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            Informations Générales
          </h2>

          {/* TITRE */}
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1 text-sm">
                Titre du produit *
              </label>
              <input
                className="w-full border p-2 rounded-md"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* SLUG */}
            <div>
              <label className="block font-medium mb-1 text-sm">
                Slug (URL)
              </label>
              <div className="flex gap-2">
                <input
                  className="w-full border p-2 rounded-md bg-gray-50"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="auto-généré si vide"
                />
                <button
                  type="button"
                  onClick={() => setSlug(slugify(title, { lower: true }))}
                  className="px-3 py-2 border rounded-md text-sm bg-gray-100 hover:bg-gray-200"
                >
                  Générer
                </button>
              </div>

              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  Le slug est la partie de l'URL qui identifie votre produit.
                </p>
                <Image
                  src="/visuels/exemple_slug.webp"
                  alt="Exemple de slug"
                  width={180}
                  height={60}
                  className="rounded-md border"
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block font-medium mb-1 text-sm">
                Description complète
              </label>
              <RichTextEditor content={desc} onChange={setDesc} />
            </div>
          </div>
        </div>

        {/* ----- VARIANTES ----- */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <VariantsEditor
            variants={variants}
            onChange={setVars}
            onFileSelect={handleFileSelect}
          />
        </div>

        {/* ----- SUBMIT ----- */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-black text-white rounded-lg font-semibold hover:bg-neutral-800 disabled:bg-neutral-400"
          >
            {isSubmitting
              ? 'Enregistrement…'
              : isEdit
              ? 'Mettre à jour le produit'
              : 'Créer le produit'}
          </button>
        </div>
      </form>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* COMPONENT: SortableImage                                                   */
/* -------------------------------------------------------------------------- */
function SortableImage({ image, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="relative w-20 h-20 group"
    >
      <div className="relative w-full h-full border rounded-md bg-white">
        <Image
          src={getStrapiMediaUrl(image.url)}
          alt="Aperçu"
          fill
          className="object-contain p-1"
        />

        <button
          type="button"
          onClick={onRemove}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-transform hover:scale-110"
        >
          <Trash2 size={16} />
        </button>

        <div
          {...listeners}
          className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center text-white opacity-0 group-hover:opacity-100"
        >
          <GripVertical size={16} />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* COMPONENT: VariantsEditor                                                  */
/* -------------------------------------------------------------------------- */
function VariantsEditor({ variants, onChange, onFileSelect }) {
  const add = () =>
    onChange([...variants, { label: '', price: '', stock: 0, images: [] }]);

  const upd = (i, key, val) => {
    const next = [...variants];
    next[i][key] = val;
    onChange(next);
  };

  const del = (i) => onChange(variants.filter((_, idx) => idx !== i));

  const addImageToVariant = (variantIndex, newImage) => {
    const current = variants[variantIndex].images || [];
    upd(variantIndex, 'images', [...current, newImage]);
  };

  const removeImage = (variantIndex, imageId) => {
    const newImages = variants[variantIndex].images.filter(
      (img) => img.id !== imageId
    );
    upd(variantIndex, 'images', newImages);
  };

  const handleDragEnd = (event, variantIndex) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = variants[variantIndex].images.findIndex(
        (img) => img.id === active.id
      );
      const newIndex = variants[variantIndex].images.findIndex(
        (img) => img.id === over.id
      );
      const reordered = arrayMove(
        variants[variantIndex].images,
        oldIndex,
        newIndex
      );
      upd(variantIndex, 'images', reordered);
    }
  };

  /* --------------------- render --------------------- */
  return (
    <div className="space-y-4">
      {/* header */}
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-lg font-semibold">Variantes *</h2>
        <button
          type="button"
          onClick={add}
          className="px-3 py-1 border rounded-md text-sm bg-gray-100 hover:bg-gray-200 font-medium"
        >
          + Ajouter une variante
        </button>
      </div>

      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800 mb-2">
          Définissez ici les différentes versions de votre produit. Chaque
          variante a son propre stock, prix et images.
        </p>
      </div>

      {/* liste des variantes */}
      {variants.map((v, i) => (
        <div
          key={i}
          className="border p-4 rounded-lg bg-gray-50 space-y-4 relative"
        >
          {/* delete badge */}
          <button
            type="button"
            onClick={() => del(i)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
          >
            <XIcon size={14} />
          </button>

          {/* champs texte ligne */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            {/* Label */}
            <div>
              <div className="min-h-[3.5rem] mb-1">
                <label className="block font-medium text-sm">Label*</label>
                <div className="text-xs text-gray-500 leading-tight">
                  (Ex&nbsp;: Taille, Format, Couleur…)
                </div>
              </div>
              <input
                value={v.label}
                onChange={(e) => upd(i, 'label', e.target.value)}
                placeholder="Ex: 100 ml"
                className="border p-2 rounded-md w-full"
                required
              />
            </div>

            {/* Stock */}
            <div>
              <div className="min-h-[3.5rem] mb-1">
                <label className="block font-medium text-sm">Stock *</label>
              </div>
              <input
                type="number"
                value={v.stock}
                min={0}
                onChange={(e) => upd(i, 'stock', Number(e.target.value))}
                className="border p-2 rounded-md w-full"
                required
              />
            </div>

            {/* Prix */}
            <div>
              <div className="min-h-[3.5rem] mb-1">
                <label className="block font-medium text-sm">Prix (€) *</label>
              </div>
              <input
                type="number"
                value={v.price}
                min={0}
                step={0.01}
                onChange={(e) => upd(i, 'price', Number(e.target.value))}
                className="border p-2 rounded-md w-full"
                required
              />
            </div>
          </div>

          {/* images */}
          <div>
            <label className="block font-medium text-sm mb-1">Images</label>

            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={(e) => handleDragEnd(e, i)}
            >
              <SortableContext
                items={v.images}
                strategy={rectSortingStrategy}
              >
                <div className="flex flex-wrap items-center gap-4">
                  {v.images.map((img) => (
                    <SortableImage
                      key={img.id}
                      image={img}
                      onRemove={() => removeImage(i, img.id)}
                    />
                  ))}

                  {/* bouton ajouter */}
                  <label
                    htmlFor={`file-upload-${i}`}
                    className="cursor-pointer w-20 h-20 border-2 border-dashed rounded-md flex flex-col items-center justify-center bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
                  >
                    <UploadCloud size={24} />
                    <span className="text-xs mt-1 font-semibold">Ajouter</span>
                  </label>

                  <input
                    id={`file-upload-${i}`}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                  onChange={(e) => {
  const file = e.target.files?.[0];
  if (file) {
    onFileSelect(file, (img) => addImageToVariant(i, img));
  }
}}

                  />
                </div>
              </SortableContext>
            </DndContext>

            <p className="text-xs text-gray-500 mt-2 ml-1">
              Formats acceptés&nbsp;: JPG, PNG (HEIC converti automatiquement).
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
