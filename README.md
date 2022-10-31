# Instalacion
## Version node 14+

``` npm install ```

## Levantar el proyecto en modo desarrollo
``` npm run start:dev ```

## Levantar el proyecto
``` npm run start ```

# Descripcion
### El proyecto esta desarrollado con Nestjs y ha sido resuelto usando REST, existen 3 rutas para probar el funcionamiento del proyecto.
### Una ruta POST para subir los archivos .txt, los cuales seran subidos a una carpeta llamada rooms ubicada en la raiz del proyecto.
### Esta ruta recibe como parametro en el body de tipo form-data un campo llamado file, en el cual se insertara la matriz de datos, que consta
### de 1 y 0 separados por , y sin coma al final. Los 0 representan espacios libres del cuarto y los 1 representan paredes
## Ejemplo de como debe ser la matriz en el archivo txt:
```
0,0,0,0
1,0,0,1
1,1,0,0
0,0,0,0
```
## Ruta post
``` localhost:3000/jmhe-api/lights/load-room ```

### Existe tambien una ruta Get en la cual se retornan todos los nombres de los archivos cargados previamente, los nombres
### de los archivos tienen el siguiente formato {numeroUnico}_{nombreDelArchivo}.txt
## Ejemplo
``` 1667194983716_prueba03.txt ```

## Ruta Get para obtener los nombres.
``` localhost:3000/jmhe-api/lights ```

### Por ultimo esta una ruta Get para obtener la solucion mas optima, la cual recibe como pathParam el nombre del archivo que se puede
### obtener de la ruta anterior, el resultado es dibujado en consola siendo la letra L(light) el lugar donde se ubican los focos y conservando.
### 0 para espacios libres y 1 para paredes de los cuartos.
## Ruta Get para Solucion, ejemplo. Sustituir el nombre entre {} por uno real.
``` localhost:3000/jmhe-api/lights/setLigths/{1667172705996_prueba03.txt} ```

## Ruta para acceder a la documentacion de Swagger
``` localhost:3000/jmhe-api/docs ```