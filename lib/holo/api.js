// Native awesome-os/lo V8 Fast API (fastcall) binding: `const { holo } = lo.load('holo')`
// Zero-HTTP replacement for lo/lib/webui using B8G_ABI_MAGIC_V3 (0x33564742).
const api = {
  abi_magic: {
    parameters: [],
    result: 'u32',
    name: 'b8g_abi_magic',
  },
  pipe_path: {
    parameters: ['i32', 'buffer', 'u32'],
    pointers: [, 'char*'],
    result: 'i32',
    name: 'b8g_sectium_pipe_path',
  },
  system_uri: {
    parameters: ['string', 'string', 'string', 'buffer', 'u32'],
    pointers: ['const char*', 'const char*', 'const char*', 'char*'],
    result: 'i32',
    name: 'b8g_system_uri_format',
  },
  v11_cas_path: {
    parameters: ['string', 'string', 'i32', 'buffer', 'u32'],
    pointers: ['const char*', 'const char*', , 'char*'],
    result: 'i32',
    name: 'b8g_v11_cas_path',
  },
  ring_init: {
    parameters: ['pointer'],
    pointers: ['B8gDisplayRing*'],
    result: 'i32',
    name: 'b8g_display_ring_init',
  },
  ring_push: {
    parameters: ['pointer', 'u32', 'u32', 'u32', 'u64'],
    pointers: ['B8gDisplayRing*'],
    result: 'i32',
    name: 'b8g_display_ring_push',
  },
  ring_pop: {
    parameters: ['pointer', 'pointer'],
    pointers: ['B8gDisplayRing*', 'B8gDisplayCmd*'],
    result: 'i32',
    name: 'b8g_display_ring_pop',
  },
};

const preamble = `#include "b8g_sectium_ffi.h"\n`;
const name = 'holo';
const libs = ['b8g_sectium'];
const includes = ['lib/holo'];

export { name, api, preamble, libs, includes };
