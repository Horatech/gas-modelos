## _1-_ En package.json agregar la dependencia

```
"modelos": "https://github.com/GPE-Sistemas/gas-modelos.git"
```

## _2-_ En package.json agregar el script para actualizar

```
"modelos": "yarn upgrade modelos"
```

## _3-_ Instalar la dependencia

```
# yarn install
```

## _4-_ Importar los modelos requeridos

```
import { ICoordenadas } from 'modelos/src';
```
