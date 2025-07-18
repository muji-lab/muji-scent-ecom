// dashboard/src/app/categories/page.js - Gestion des catégories avec drag & drop

'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FolderOpen, Folder, ChevronRight, Info, ChevronDown, GripVertical } from 'lucide-react';
import { fetchCategories, deleteCategory, updateCategory } from '@/lib/api';
import Link from 'next/link';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Composant pour une catégorie triable
function SortableCategory({ category, onDelete, onToggleExpand, isExpanded }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: category.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="p-4 flex items-center justify-between hover:bg-neutral-50 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="w-4 h-4 text-neutral-400" />
          </div>
          <Folder className="w-5 h-5 text-neutral-600" />
          <div>
            <h3 className="font-semibold text-neutral-900">{category.name}</h3>
            {category.description && (
              <p className="text-sm text-neutral-600">{category.description}</p>
            )}
            <p className="text-xs text-neutral-500">
              {category.products?.length || 0} produit(s)
              {category.subCategories?.length > 0 && (
                <span> • {category.subCategories.length} sous-catégorie(s)</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {category.subCategories?.length > 0 && (
            <button
              onClick={() => onToggleExpand(category.id)}
              className="p-2 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              <ChevronDown className={`w-4 h-4 text-neutral-600 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`} />
            </button>
          )}
          <Link
            href={`/categories/edit/${category.documentId}`}
            className="p-2 hover:bg-neutral-200 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4 text-neutral-600" />
          </Link>
          <button
            onClick={() => onDelete(category.documentId)}
            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
      
      {/* Sous-catégories */}
      {isExpanded && category.subCategories?.length > 0 && (
        <div className="bg-neutral-25">
          {category.subCategories.map((child) => (
            <div key={child.id} className="p-4 pl-16 flex items-center justify-between hover:bg-neutral-50">
              <div className="flex items-center gap-3">
                <ChevronRight className="w-4 h-4 text-neutral-400" />
                <FolderOpen className="w-4 h-4 text-neutral-500" />
                <div>
                  <h4 className="font-medium text-neutral-800">{child.name}</h4>
                  {child.description && (
                    <p className="text-sm text-neutral-600">{child.description}</p>
                  )}
                  <p className="text-xs text-neutral-500">
                    {child.products?.length || 0} produit(s)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/categories/edit/${child.documentId}`}
                  className="p-2 hover:bg-neutral-200 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4 text-neutral-600" />
                </Link>
                <button
                  onClick={() => onDelete(child.documentId)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        await deleteCategory(documentId);
        loadCategories();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de la catégorie');
      }
    }
  };

  const handleToggleExpand = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const mainCategories = categories.filter(cat => !cat.parentCategory);
      const oldIndex = mainCategories.findIndex(cat => cat.id === active.id);
      const newIndex = mainCategories.findIndex(cat => cat.id === over.id);
      
      const reorderedCategories = arrayMove(mainCategories, oldIndex, newIndex);
      
      // Mise à jour locale immédiate
      const allCategories = [...categories];
      const subcategories = categories.filter(cat => cat.parentCategory);
      const newOrder = [...reorderedCategories, ...subcategories];
      setCategories(newOrder);
      
      // Mise à jour des sortOrder sur le serveur
      try {
        await Promise.all(
          reorderedCategories.map((cat, index) => 
            updateCategory(cat.documentId, { sortOrder: index })
          )
        );
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'ordre:', error);
        // Recharger en cas d'erreur
        loadCategories();
      }
    }
  };

  // Organiser les catégories par hiérarchie
  const organizeCategories = (categories) => {
    const rootCategories = categories.filter(cat => !cat.parentCategory)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    const childCategories = categories.filter(cat => cat.parentCategory);
    
    const organized = rootCategories.map(parent => ({
      ...parent,
      subCategories: childCategories.filter(child => child.parentCategory?.id === parent.id)
    }));
    
    return organized;
  };

  const organizedCategories = organizeCategories(categories);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Catégories</h1>
        <Link
          href="/categories/new"
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-2 font-semibold text-sm"
        >
          <Plus className="w-4 h-4" />
          Nouvelle Catégorie
        </Link>
      </div>

      {/* Info sur le drag & drop */}
      <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Organisation des catégories</span>
        </div>
        <p className="text-sm text-blue-700">
          Utilisez les poignées <GripVertical className="w-4 h-4 inline mx-1" /> pour réorganiser l'ordre des catégories principales par glisser-déposer.
        </p>
      </div>

      {/* Liste des catégories */}
      <div className="bg-white rounded-lg shadow-md">
        {organizedCategories.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
            <p>Aucune catégorie créée.</p>
            <p className="text-sm">Commencez par créer votre première catégorie.</p>
          </div>
        ) : (
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={organizedCategories} strategy={verticalListSortingStrategy}>
              {organizedCategories.map((category) => (
                <SortableCategory
                  key={category.id}
                  category={category}
                  onDelete={handleDelete}
                  onToggleExpand={handleToggleExpand}
                  isExpanded={expandedCategories.has(category.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}