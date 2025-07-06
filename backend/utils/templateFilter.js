function filterTemplatesByPermission(templates, currentUser) {
  return templates.filter(template => {
    if (template.access == 'public') return true;

    if (!currentUser) return false;

    const isOwner = template.authorId === currentUser.id;
    const isAdmin = currentUser.isAdmin === true;

    return isOwner || isAdmin;
  });
}

module.exports = { filterTemplatesByPermission };
