#include <iostream>
#include <chrono>
#include "lru_cache.h"
#include "db.h"

using namespace chrono;

int main() {
    int totalRequests = 0;
    int cacheHits = 0;
    LRUCache cache(2);  // capacity = 2
    int key;

    while (true) {
    cout << "\n=============================\n";
    cout << " SMART MEMORY CACHE SYSTEM\n";
    cout << "=============================\n";
    cout << "1. Fetch Data\n";
    cout << "2. Exit\n";
    cout << "Enter choice: ";

    int choice;
    cin >> choice;

    if (choice == 2) {
        cout << "Exiting...\n";
        break;
    }

    if (choice == 1) {
        cout << "Enter key: ";
        cin >> key;

        totalRequests++;

        auto start = chrono::high_resolution_clock::now();

        string value = cache.get(key);

        if (value != "") {
            cacheHits++;
            cout << " Cache HIT: " << value << endl;
        } else {
            cout << " Cache MISS\n";

            value = fetchFromDB(key);
            cache.put(key, value);

            cout << "DB Value: " << value << endl;
        }

        auto end = chrono::high_resolution_clock::now();
        auto duration = chrono::duration_cast<chrono::microseconds>(end - start);

        cout << " Time: " << duration.count() << " us\n";

        double hitRate = (double)cacheHits / totalRequests * 100;
        cout << " Hit Rate: " << hitRate << "%\n";
    }
}

    return 0;
}