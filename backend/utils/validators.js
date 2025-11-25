
export const nameValid = (s) =>  s.length >= 4 && s.length <= 60;
export const addressValid = (s) => !s || (typeof s === "string" && s.length <= 400);
export const emailValid = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
export const passwordValid = (p) => /^(?=.{8,16}$)(?=.*[A-Z])(?=.*[^A-Za-z0-9]).*$/.test(p);
export const ratingValid = (n) => Number.isInteger(n) && n >= 1 && n <= 5;
