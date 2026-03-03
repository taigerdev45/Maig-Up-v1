import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import sanitizeHtml from 'sanitize-html';

// Recursively sanitize all strings in an object/array
const sanitizeData = (data: any): any => {
  if (typeof data === 'string') {
    return sanitizeHtml(data, {
      allowedTags: [], // Strip all HTML tags
      allowedAttributes: {}, // Strip all attributes
    });
  }
  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  }
  if (typeof data === 'object' && data !== null) {
    const sanitizedObj: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        sanitizedObj[key] = sanitizeData(data[key]);
      }
    }
    return sanitizedObj;
  }
  return data;
};

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Layer 1: Validate Schema (Types, formats, required fields)
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: result.error.issues.map((e: any) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
      return;
    }
    
    // Layer 2: Sanitize Data (Strip HTML/XSS)
    req.body = sanitizeData(result.data);
    
    next();
  };
};
