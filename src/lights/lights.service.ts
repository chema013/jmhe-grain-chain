import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { color, log } from 'console-log-colors';
const { red, green, cyan } = color;

import { SetLigthsParamsDTO } from './dto/request/loadtxt';

@Injectable()
export class LightsService {
  findAll() {
    try {
      const documentPath = path.join(__dirname, '../../rooms');
      const files = fs.readdirSync(documentPath);

      if (!files) {
        throw new NotFoundException('files does not found');
      }

      return files;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async loadTxt(file: Express.Multer.File) {
    if (!file?.path) {
      throw new NotFoundException('File does not found');
    }

    let data: any;
    try {
      data = fs.readFileSync(file?.path, 'utf-8');
    } catch (error) {
      throw new BadRequestException(error.message | error.messages | error);
    }

    console.log('\nMatriz recibida: ');
    console.log(data);
    let rowSize = 0;
    let columnSize = 0;

    let cleanString = data.split('\r').join('');
    let cleanString2 = cleanString.split(',').join('');
    let dataSepareted = cleanString2.split('\n');
    rowSize = dataSepareted.length;
    columnSize = dataSepareted[0].length;
    for (const myRow of dataSepareted) {
      if (columnSize != myRow.length) {
        throw new BadRequestException(
          'Matriz invalida, el tamaño de las filas no es consistente',
        );
      }
    }

    const validCaracters = '10,\n';
    for (const item of cleanString2) {
      if (!validCaracters.includes(item)) {
        throw new BadRequestException(
          'Matriz invalida, los unicos caracteres perimitidos son 01 y ,',
        );
      }
    }

    return await data;
  }

  async setLigths(params: SetLigthsParamsDTO) {
    let fileName = this.searchDocumentName(params.fileName);
    if (fileName) {
      const documentPath = path.join(__dirname, '../../rooms');
      const data = fs.readFileSync(`${documentPath}/${fileName}`, 'utf-8');

      let rowSize = 0;
      let columnSize = 0;

      let cleanString = data.split('\r').join('');
      let dataSepareted = cleanString.split('\n');
      rowSize = dataSepareted.length;
      let columnWhitoutComma = dataSepareted[0].split(',').join('');
      columnSize = columnWhitoutComma.length;

      /* algoritmo */
      let empty = this.loadMatriz(dataSepareted);
      let results = [];
      for (let i = 0; i < rowSize; i++) {
        for (let j = 0; j < columnSize; j++) {
          if (empty[i][j] === '0') {
            let response = this.doAlgoritm(
              rowSize,
              columnSize,
              j,
              i,
              dataSepareted,
            );
            results.push(response);
          }
        }
      }

      const orderedResult = results.sort((a, b) => {
        return a - b;
      });

      let resultToString = '';
      for (const row of orderedResult[0].array) {
        let rowToString = row.join();
        resultToString = resultToString + rowToString + '\n';
      }
      this.printResult(resultToString, orderedResult[0].numberOfLigths);

      return { ...orderedResult[0], array: resultToString };
    }
  }

  printResult(data: string, numberOfLigths: number) {
    log.magenta('********* Resultado *********\n');
    log.bgBlack(`Número de focos: ${numberOfLigths}`);
    for (const item of data) {
      if (item === 'L') {
        process.stdout.write(`${red(item)}`);
      } else if (item === '0') {
        process.stdout.write(`${green(item)}`);
      } else if (item === '1') {
        process.stdout.write(`${cyan(item)}`);
      } else if (item === ',') {
        process.stdout.write(` `);
      } else if (item === '\n') {
        console.log();
      }
    }
    /*
    log.red('perro');
    log.blue('Gato');
    process.stdout.write(`${red("color.red('text')"), green('perro')}`);
    process.stdout.write(`${red("color.red('text')")}`);
    */
  }

  doAlgoritm(
    rowSize: number,
    columnSize: number,
    pCol: number,
    pRow: number,
    dataSepareted: string[],
  ) {
    let auxEmpty = this.loadMatriz(dataSepareted);
    let auxResult = this.loadMatriz(dataSepareted);
    let contResult = 0;

    auxResult[pRow][pCol] = 'L';
    contResult++;
    auxEmpty = this.getfree(pRow, pCol, columnSize, rowSize, auxEmpty);

    for (let i = 0; i < rowSize; i++) {
      for (let j = 0; j < columnSize; j++) {
        if (auxEmpty[i][j] === '0') {
          auxResult[i][j] = 'L';
          contResult++;
          auxEmpty = this.getfree(i, j, columnSize, rowSize, auxEmpty);

          //console.log(`${i},${j}` + 'empty', auxEmpty);
          //console.log(`${i},${j}` + 'result', auxResult);
        }
      }
    }

    return { numberOfLigths: contResult, array: auxResult };
  }

  getfree(
    row: number,
    col: number,
    colSize: number,
    rowSize: number,
    empty: any[],
  ) {
    //barre adelante
    for (let i = col; i < colSize; i++) {
      if (empty[row][i] != '1') {
        empty[row][i] = '-';
      } else {
        break;
      }
    }

    //Barre atras
    for (let i = col; i >= 0; i--) {
      if (empty[row][i] != '1') {
        empty[row][i] = '-';
      } else {
        break;
      }
    }

    //barre abajo
    for (let i = row; i < rowSize; i++) {
      if (empty[i][col] != '1') {
        empty[i][col] = '-';
      } else {
        break;
      }
    }

    //arriba
    for (let i = row; i >= 0; i--) {
      if (empty[i][col] != '1') {
        empty[i][col] = '-';
      } else {
        break;
      }
    }

    return empty;
  }

  loadMatrizComplete(rowSize: number, columnSize: number) {
    let matriz = [];
    let aux = [];
    for (let i = 0; i < rowSize; i++) {
      for (let j = 0; j < columnSize; j++) {
        aux[j] = '1';
      }
      matriz[i] = aux;
      aux = [];
    }

    return matriz;
  }

  loadMatriz(data: string[]) {
    let matriz = [];

    let row = 0;
    for (const item of data) {
      matriz[row] = item.split(',');
      row++;
    }

    return matriz;
  }

  searchDocumentName(singleName: string) {
    const documentPath = path.join(__dirname, '../../rooms');
    const files = fs.readdirSync(documentPath);

    if (files.includes(singleName)) {
      const index = files.indexOf(singleName);
      return files[index];
    } else {
      throw new NotFoundException('File Does Not Exist');
    }
  }
}
