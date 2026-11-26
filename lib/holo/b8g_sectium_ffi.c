#include "b8g_sectium_ffi.h"

#include <stdio.h>
#include <string.h>

static int is_safe_segment(const char *s) {
    if (!s || s[0] == '\0') return 0;
    if (strstr(s, "..") != NULL) return 0;
    for (const char *p = s; *p != '\0'; p++) {
        char c = *p;
        int ok = (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') ||
                 (c >= '0' && c <= '9') || c == '-' || c == '_' || c == '.';
        if (!ok) return 0;
    }
    return 1;
}

static int is_valid_hex(const char *s) {
    if (!s) return 0;
    size_t len = strlen(s);
    if (len != 64 && len != 128) return 0;
    for (size_t i = 0; i < len; i++) {
        char c = s[i];
        int ok = (c >= '0' && c <= '9') || (c >= 'a' && c <= 'f') || (c >= 'A' && c <= 'F');
        if (!ok) return 0;
    }
    return 1;
}

uint32_t b8g_abi_magic(void) {
    return B8G_ABI_MAGIC_V3;
}

int b8g_sectium_pipe_path(int is_windows, char *out_buf, size_t out_len) {
    if (!out_buf || out_len == 0) return -1;
    const char *path = is_windows ? "\\\\.\\pipe\\sectium-dev" : "/tmp/sectium-dev.sock";
    int n = snprintf(out_buf, out_len, "%s", path);
    return (n > 0 && (size_t)n < out_len) ? n : -1;
}

int b8g_system_uri_format(const char *host, const char *surface, const char *target,
                          char *out_buf, size_t out_len) {
    if (!out_buf || out_len == 0) return -1;
    if (!is_safe_segment(host) || !is_safe_segment(target)) return -1;
    if (!surface || (strcmp(surface, "terminal") != 0 && strcmp(surface, "desktop") != 0)) {
        return -1;
    }
    int n = snprintf(out_buf, out_len, "system://%s/%s/%s", host, surface, target);
    return (n > 0 && (size_t)n < out_len) ? n : -1;
}

int b8g_v11_cas_path(const char *cas_root, const char *sha512_hex, int is_exec,
                     char *out_buf, size_t out_len) {
    if (!cas_root || cas_root[0] == '\0' || strstr(cas_root, "..") != NULL) return -1;
    if (!is_valid_hex(sha512_hex) || !out_buf || out_len == 0) return -1;
    int n = snprintf(out_buf, out_len, "%s/v11/files/%c%c/%s%s",
                     cas_root, sha512_hex[0], sha512_hex[1], sha512_hex,
                     is_exec ? "-exec" : "");
    return (n > 0 && (size_t)n < out_len) ? n : -1;
}

int b8g_display_ring_init(B8gDisplayRing *ring) {
    if (!ring) return -1;
    memset(ring, 0, sizeof(*ring));
    ring->magic = B8G_ABI_MAGIC_V3;
    ring->capacity = B8G_DISPLAY_RING_CAP;
    return 0;
}

int b8g_display_ring_push(B8gDisplayRing *ring, uint32_t opcode, uint32_t width,
                          uint32_t height, uint64_t handle) {
    if (!ring || ring->magic != B8G_ABI_MAGIC_V3) return -1;
    uint32_t next = (ring->head + 1U) & (B8G_DISPLAY_RING_CAP - 1U);
    if (next == ring->tail) return -2; /* ring full */
    ring->slots[ring->head].opcode = opcode;
    ring->slots[ring->head].width = width;
    ring->slots[ring->head].height = height;
    ring->slots[ring->head].reserved = 0;
    ring->slots[ring->head].handle = handle;
    ring->head = next;
    return 0;
}

int b8g_display_ring_pop(B8gDisplayRing *ring, B8gDisplayCmd *out_cmd) {
    if (!ring || !out_cmd || ring->magic != B8G_ABI_MAGIC_V3) return -1;
    if (ring->head == ring->tail) return 0; /* empty */
    *out_cmd = ring->slots[ring->tail];
    ring->tail = (ring->tail + 1U) & (B8G_DISPLAY_RING_CAP - 1U);
    return 1;
}
