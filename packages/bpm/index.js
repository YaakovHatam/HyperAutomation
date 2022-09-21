import { watch } from 'chokidar';

watch('../../temp').on('all', (event, path) => {
   console.log(event, path);
});