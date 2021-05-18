// Validation errors messages for Parsley
// Load this after Parsley

Parsley.addMessages('de', {
  defaultMessage: "Die Eingabe scheint nicht korrekt zu sein.",
  type: {
    email:        "Die Eingabe muss eine gültige E-Mail-Adresse sein.",
    url:          "Die Eingabe muss eine gültige URL sein.",
    number:       "Die Eingabe muss eine Zahl sein.",
    integer:      "Die Eingabe muss eine Zahl sein.",
    digits:       "Die Eingabe darf nur Ziffern enthalten.",
    alphanum:     "Die Eingabe muss alphanumerisch sein."
  },

  dateiso:        "Die Eingabe muss ein gültiges Datum sein (YYYY-MM-DD).",
  equalto:        "Dieses Feld muss dem anderen entsprechen.",

  notblank:       "Die Eingabe darf nicht leer sein.",
  required:       "Dies ist ein Pflichtfeld.",
  pattern:        "Die Eingabe scheint ungültig zu sein.",

  // Wortzahl mehr als
  gt:             "Die Eingabe muss größer sein.",
  gte:            "Die Eingabe muss größer oder gleich sein.",
  min:            "Die Eingabe muss größer oder gleich %s sein.",
  minwords:       "Die Eingabe ist zu kurz. Sie muss aus %s oder mehr Wörtern bestehen.",
  minlength:      "Die Eingabe muss mindestens %s Zeichen lang sein.",

  // Wortzahl weniger als
  lt:             "Die Eingabe muss kleiner sein.",
  lte:            "Die Eingabe muss kleiner oder gleich sein.",
  max:            "Die Eingabe muss kleiner oder gleich %s sein.",
  maxwords:       "Die Eingabe ist zu lang. Sie muss aus %s oder weniger Wörtern bestehen.",
  maxlength:      "Die Eingabe ist zu lang. Es dürfen höchstens %s Zeichen eingegeben werden.",

  range:          "Die Eingabe muss zwischen %s und %s liegen.",
  words:          "Die Länge der Eingabe ist ungültig. Sie muss zwischen %s und %s Wörter enthalten.",
  length:         "Die Länge der Eingabe ist ungültig. Es müssen zwischen %s und %s Zeichen eingegeben werden.",
  mincheck:       "Wählen Sie mindestens %s Angaben aus.",
  maxcheck:       "Wählen Sie maximal %s Angaben aus.",
  check:          "Wählen Sie zwischen %s und %s Angaben."
});

Parsley.setLocale('de');