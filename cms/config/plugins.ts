export default ({ env }) => ({
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '7d',
      },
      register: {
        allowedFields: ['firstName', 'lastName', 'phone', 'address', 'city', 'postalCode', 'country'],
      },
      // Ajouter les champs autorisés pour les mises à jour
      providers: {
        local: {
          allowedFields: ['firstName', 'lastName', 'phone', 'address', 'city', 'postalCode', 'country'],
        },
      },
    },
  },
});