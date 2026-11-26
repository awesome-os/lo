#ifndef B8G_SECTIUM_FFI_H
#define B8G_SECTIUM_FFI_H

#include <stddef.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

#if defined(_WIN32) || defined(__CYGWIN__)
#  define B8G_EXPORT __declspec(dllexport)
#else
#  define B8G_EXPORT __attribute__((visibility("default")))
#endif

#define B8G_ABI_MAGIC_V3 0x33564742U
#define B8G_DISPLAY_RING_CAP 64U

typedef struct {
    uint32_t opcode;
    uint32_t width;
    uint32_t height;
    uint32_t reserved;
    uint64_t handle;
} B8gDisplayCmd;

typedef struct {
    _Alignas(64) uint32_t magic;
    uint32_t head;
    uint32_t tail;
    uint32_t capacity;
    uint32_t pad[12];
    B8gDisplayCmd slots[B8G_DISPLAY_RING_CAP];
} B8gDisplayRing;

B8G_EXPORT uint32_t b8g_abi_magic(void);
B8G_EXPORT int b8g_sectium_pipe_path(int is_windows, char *out_buf, size_t out_len);
B8G_EXPORT int b8g_system_uri_format(const char *host, const char *surface, const char *target,
                                     char *out_buf, size_t out_len);
B8G_EXPORT int b8g_v11_cas_path(const char *cas_root, const char *sha512_hex, int is_exec,
                                char *out_buf, size_t out_len);
B8G_EXPORT int b8g_display_ring_init(B8gDisplayRing *ring);
B8G_EXPORT int b8g_display_ring_push(B8gDisplayRing *ring, uint32_t opcode, uint32_t width,
                                     uint32_t height, uint64_t handle);
B8G_EXPORT int b8g_display_ring_pop(B8gDisplayRing *ring, B8gDisplayCmd *out_cmd);

#ifdef __cplusplus
}
#endif

#endif /* B8G_SECTIUM_FFI_H */
