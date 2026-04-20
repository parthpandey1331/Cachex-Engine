#include "lru_cache.h"
#include <string>

LRUCache::LRUCache(int cap) {
    capacity = cap;
}

string LRUCache::get(int key) {
    if (map.find(key) == map.end()) {
        misses++;   // 👈 ADD THIS
        return "";
    }

    hits++;  

    auto it = map[key];
    string value = it->second;

    cache.erase(it);
    cache.push_front({key, value});
    map[key] = cache.begin();

    return value;
}

void LRUCache::put(int key, string value) {
    if (map.find(key) != map.end()) {
        cache.erase(map[key]);
    }
    else if (cache.size() == capacity) {
        auto last = cache.back();
        map.erase(last.first);
        cache.pop_back();
    }

    cache.push_front({key, value});
    map[key] = cache.begin();
}

int LRUCache::getHits() {
    return hits;
}

int LRUCache::getMisses() {
    return misses;
}