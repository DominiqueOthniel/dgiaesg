/**
 * Transforms a string into a localized object for Mongoose models.
 * If the input is already an object with 'fr' and 'en', it returns it as is.
 * Otherwise, it wraps the string value into both 'fr' and 'en'.
 */
export const localize = (value: any) => {
  if (typeof value === 'string') {
    return { fr: value, en: value };
  }
  if (value && typeof value === 'object' && (value.fr || value.en)) {
    return {
      fr: value.fr || value.en || '',
      en: value.en || value.fr || '',
    };
  }
  return value;
};

/**
 * Specifically for objects where multiple fields might need localization.
 * Example: localizeFields(req.body, ['title', 'description', 'content'])
 */
export const localizeFields = (data: any, fields: string[]) => {
  const updated = { ...data };
  fields.forEach(field => {
    if (updated[field] !== undefined) {
      updated[field] = localize(updated[field]);
    }
  });
  return updated;
};
