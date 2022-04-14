import { BaseCSVType } from '../types';

// USDAGE:

export class CSVManager {
  content: string;

  newLineChar = '\n';

  fieldSeparatorChar = ',';

  constructor(file: string) {
    this.content = file;
  }

  public processCSV = <T extends BaseCSVType>(delim = ','): T[] => {
    this.fieldSeparatorChar = delim;

    const result: T[] = [];
    const headers: string[] = [];
    const rawObjects = this.processRawData();
    rawObjects.forEach((v, i) => {
      if (i === 0) {
        v.forEach((h) => headers.push(h.trim()));
      } else {
        // actual objects
        const newItem: Record<string, string> = {};
        v.forEach((value, j) => {
          const header = headers[j];
          newItem[header] = value.trim();
        });
        result.push(newItem as T);
      }
    });
    return result;
  };

  processRawData(): string[][] {
    let csvStr = this.content;
    let result: string[][] = [];

    let lineEndIndexMoved = false;
    let lineStartIndex = 0;
    let lineEndIndex = 0;
    let csrIndex = 0;
    let cursorVal = csvStr[csrIndex];
    const foundNewLineChar = CSVManager.getNewLineChar(csvStr);
    let inQuote = false;

    // Handle

    if (foundNewLineChar === '\n') {
      csvStr = csvStr.split(foundNewLineChar).join(this.newLineChar);
    }
    // Handle the last character is not

    if (csvStr[csvStr.length - 1] !== this.newLineChar) {
      csvStr += this.newLineChar;
    }

    while (csrIndex < csvStr.length) {
      if (cursorVal === '"') {
        inQuote = !inQuote;
      } else if (cursorVal === this.newLineChar) {
        if (inQuote === false) {
          if (lineEndIndexMoved && lineStartIndex <= lineEndIndex) {
            result.push(
              this.parseCsvLine(csvStr.substring(lineStartIndex, lineEndIndex))
            );
            lineStartIndex = csrIndex + 1;
          } // Else: just ignore line_end_index has not moved or line has not been sliced for parsing the line
        } // Else: just ignore because we are in a quote
      }
      csrIndex++;
      cursorVal = csvStr[csrIndex];
      lineEndIndex = csrIndex;
      lineEndIndexMoved = true;
    }

    // Handle

    if (foundNewLineChar === '\n') {
      const newResult = [];
      let currRow;
      for (let i = 0; i < result.length; i++) {
        currRow = [];
        for (let j = 0; j < result[i].length; j++) {
          currRow.push(result[i][j].split(this.newLineChar).join('\n'));
        }
        newResult.push(currRow);
      }
      result = newResult;
    }
    return result;
  }

  parseCsvLine(csvLineStrArg: string): string[] {
    let csvLineStr = csvLineStrArg;
    const result = [];

    // let field_end_index_moved = false;
    let fieldStartIndex = 0;
    let fieldEndIndex = 0;
    let csrIndex = 0;
    let cursorVal = csvLineStr[csrIndex];
    let inQuote = false;

    // Pretend that the last char is the separator_char to complete the loop
    csvLineStr += this.fieldSeparatorChar;

    while (csrIndex < csvLineStr.length) {
      if (cursorVal === '"') {
        inQuote = !inQuote;
      } else if (cursorVal === this.fieldSeparatorChar) {
        if (inQuote === false) {
          if (fieldStartIndex <= fieldEndIndex) {
            result.push(
              CSVManager.parseCsvField(
                csvLineStr.substring(fieldStartIndex, fieldEndIndex)
              )
            );
            fieldStartIndex = csrIndex + 1;
          } // Else: just ignore field_end_index has not moved or field has not been sliced for parsing the field
        } // Else: just ignore because we are in quote
      }
      csrIndex++;
      cursorVal = csvLineStr[csrIndex];
      fieldEndIndex = csrIndex;
      // field_end_index_moved = true;
    }
    return result;
  }

  static parseCsvField(csvFieldStrArg: string): string {
    let csvFieldStr = csvFieldStrArg;
    const withQuote = csvFieldStr[0] === '"';

    if (withQuote) {
      csvFieldStr = csvFieldStr.substring(1, csvFieldStr.length - 1); // remove the start and end quotes
      csvFieldStr = csvFieldStr.split('""').join('"'); // handle double quotes
    }
    return csvFieldStr.replace(/^\s+|\s+$/g, '');
  }

  static getNewLineChar(csvStr: string): string {
    if (csvStr.indexOf('\n') > -1) {
      return '\n';
    }
    return '\n';
  }

  static parseLine(line: string): string[] {
    if (line.indexOf('"') < 0) return line.split(',');

    const result: string[] = [];
    let cell = '';
    let quote = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' && line[i + 1] === '"') {
        cell += char;
        i++;
      } else if (char === '"') {
        quote = !quote;
      } else if (!quote && char === ',') {
        result.push(cell as string);
        cell = '';
      } else {
        cell += char;
      }
      if (i === line.length - 1 && cell) {
        result.push(cell as string);
      }
    }
    return result;
  }
}
