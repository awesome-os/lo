// High-level Awesome-OS Holo wrapper for awesome-os/lo (zero-HTTP Sectium + v11 CAS)
const { utf8Decode } = lo;

export function createHoloClient(holoBinding = lo.load('holo').holo) {
  const scratch = new Uint8Array(512);
  return {
    abiMagic: () => holoBinding.abi_magic(),
    pipePath: (isWindows = lo.core.os === 'win') => {
      const n = holoBinding.pipe_path(isWindows ? 1 : 0, scratch, scratch.length);
      if (n <= 0) throw new Error('Failed to resolve Sectium pipe path');
      return utf8Decode(scratch.ptr, n);
    },
    systemUri: (host, surface, target) => {
      const n = holoBinding.system_uri(host, surface, target, scratch, scratch.length);
      if (n <= 0) throw new Error(`Invalid system:// URI (${host}/${surface}/${target})`);
      return utf8Decode(scratch.ptr, n);
    },
    v11CasPath: (casRoot, sha512Hex, isExec = false) => {
      const n = holoBinding.v11_cas_path(casRoot, sha512Hex, isExec ? 1 : 0, scratch, scratch.length);
      if (n <= 0) throw new Error('Invalid v11 CAS path or digest');
      return utf8Decode(scratch.ptr, n);
    },
  };
}
