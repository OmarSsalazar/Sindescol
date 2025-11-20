import { parse } from 'csv-parse/sync';

export const parseCsvBuffer = async (buffer) => {
  const text = buffer.toString('utf8');
  // try parsing CSV (comma or semicolon) -- detect delimiter
  let records = [];
  try {
    records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true
    });
    return records;
  } catch (e) {
    // fallback: try tab-delimited or simple lines
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    const parsed = lines.map(line => {
      const parts = line.split(/[,;\t]/);
      // if simple format: cedula,mes,anio,valor
      return {
        cedula: parts[0] ?? null,
        mes: parts[1] ?? null,
        anio: parts[2] ?? null,
        valor: parts[3] ?? null
      };
    });
    return parsed;
  }
};