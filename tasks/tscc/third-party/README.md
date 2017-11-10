From `tsickle@0.25.0`, patched https://github.com/angular/tsickle/blob/master/src/main.ts#L130,
so that tsickle does not skip some files due to mismatch of absolute paths and relative paths.

Once this issue  https://github.com/angular/tsickle/issues/617 is marked as fixed, we may be able to remove this workaround.
