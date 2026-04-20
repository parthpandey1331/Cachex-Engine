#include "db.h"
#include <sqlite3.h>
#include <iostream>
#include <string>

using namespace std;

string fetchFromDB(int key) {
    sqlite3 *db;
    sqlite3_stmt *stmt;
    string result = "Not Found";

    if (sqlite3_open("cache.db", &db)) {
        cout << "DB error\n";
        return result;
    }

    string query = "SELECT value FROM data_store WHERE id = ?;";

    sqlite3_prepare_v2(db, query.c_str(), -1, &stmt, NULL);
    sqlite3_bind_int(stmt, 1, key);

    if (sqlite3_step(stmt) == SQLITE_ROW) {
        result = (const char*)sqlite3_column_text(stmt, 0);
    }

    sqlite3_finalize(stmt);
    sqlite3_close(db);

    return result;
}