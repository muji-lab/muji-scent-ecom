export default () => ({});
// cms/config/plugins.js

module.exports = ({ env }) => ({
  'users-permissions': {
    config: {
      jwt: {
        secret: env('JWT_SECRET'),
      },
    },
  },
});