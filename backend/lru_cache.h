#ifndef LRU_CACHE_H
#define LRU_CACHE_H

#include <unordered_map>
#include <list>
#include <string>
using namespace std;

class LRUCache {
    int capacity;
    list<pair<int, string>> cache;
    unordered_map<int, list<pair<int, string>>::iterator> map;

   
    int hits = 0;
    int misses = 0;

public:
    LRUCache(int cap);
    string get(int key);
    void put(int key, string value);

    
    int getHits();
    int getMisses();
};

#endif