// This needs to be before any imports, thus spearate and referenced first in jest setupFiles - https://github.com/facebook/jest/issues/4545#issuecomment-332762365
const g:any = global;

g.requestAnimationFrame = (callback) => {
    setTimeout(callback, 0);
};
