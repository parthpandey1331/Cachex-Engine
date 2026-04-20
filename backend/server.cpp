#include <iostream>
#include <sqlite3.h> 
#include "httplib.h"
#include "lru_cache.h"
#include "db.h"


using namespace std;

LRUCache cache(3);

int totalRequests = 0;
int cacheHits = 0;

int main() {
    httplib::Server svr;

    svr.Get("/get", [](const httplib::Request& req, httplib::Response& res) {
        if (!req.has_param("key")) {
            res.set_header("Access-Control-Allow-Origin", "*");
            res.set_content("{\"error\":\"Key missing\"}", "application/json");
            return;
        }

        int key = stoi(req.get_param_value("key"));

        totalRequests++;

        string value = cache.get(key);

        string result;

        if (value != "") {
            cacheHits++;
            result = " Cache HIT: " + value;
        } 
        else {
            value = fetchFromDB(key);

            if (value == "Not Found") {
                res.set_header("Access-Control-Allow-Origin", "*");
                res.set_content("{\"result\":\"Key not found\"}", "application/json");
                return;
            }

            cache.put(key, value);
            result = "Cache Miss -> " + value;
        }

        double hitRate = (double)cacheHits / totalRequests * 100;

        string response = "{ \"result\": \"" + result + "\", \"hitRate\": " + to_string(hitRate) +  ", \"hits\": " + to_string(cache.getHits()) +", \"misses\": " + to_string(cache.getMisses()) + " }";
        res.set_header("Access-Control-Allow-Origin", "*");  
        res.set_content(response, "application/json");
     });

     svr.Get("/keys", [](const httplib::Request&, httplib::Response& res) {

            sqlite3 *db;
            sqlite3_stmt *stmt;

            string json = "[";

            if (sqlite3_open("cache.db", &db)) {
                res.set_content("[]", "application/json");
                return;
            }

            string query = "SELECT id, value FROM data_store;";
            sqlite3_prepare_v2(db, query.c_str(), -1, &stmt, NULL);

            bool first = true;

            while (sqlite3_step(stmt) == SQLITE_ROW) {
                int id = sqlite3_column_int(stmt, 0);
                string value = (const char*)sqlite3_column_text(stmt, 1);

                if (!first) json += ",";
                json += "{ \"id\": " + to_string(id) + ", \"value\": \"" + value + "\" }";

                first = false;
            }

            json += "]";

            sqlite3_finalize(stmt);
            sqlite3_close(db);

            res.set_header("Access-Control-Allow-Origin", "*");
            res.set_content(json, "application/json");
        });
    
     svr.Get("/clear", [](const httplib::Request&, httplib::Response& res) {
            cache = LRUCache(3);
            cacheHits = 0;
            totalRequests = 0;

            res.set_header("Access-Control-Allow-Origin", "*");
            res.set_content("{\"message\":\"Cache Cleared\"}", "application/json");
        });
      svr.Get("/add", [](const httplib::Request& req, httplib::Response& res) {

            if (!req.has_param("value")) {
                res.set_header("Access-Control-Allow-Origin", "*");
                res.set_content("{\"error\":\"No value provided\"}", "application/json");
                return;
            }

            string value = req.get_param_value("value");

            sqlite3 *db;
            sqlite3_open("cache.db", &db);

            string query = "INSERT INTO data_store (value) VALUES ('" + value + "');";
            sqlite3_exec(db, query.c_str(), 0, 0, 0);

            sqlite3_close(db);

            res.set_header("Access-Control-Allow-Origin", "*");
            res.set_content("{\"message\":\"Data added\"}", "application/json");
        });  

    svr.Get("/delete", [](const httplib::Request& req, httplib::Response& res) {

        if (!req.has_param("id")) {
            res.set_header("Access-Control-Allow-Origin", "*");
            res.set_content("{\"error\":\"No id provided\"}", "application/json");
            return;
        }

        int id = stoi(req.get_param_value("id"));

        sqlite3 *db;
        sqlite3_open("cache.db", &db);

        string query = "DELETE FROM data_store WHERE id=" + to_string(id) + ";";
        sqlite3_exec(db, query.c_str(), 0, 0, 0);

        sqlite3_close(db);

    
        cache = LRUCache(3);

        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_content("{\"message\":\"Deleted\"}", "application/json");
    });

    svr.Get("/update", [](const httplib::Request& req, httplib::Response& res) {

        if (!req.has_param("id") || !req.has_param("value")) {
            res.set_header("Access-Control-Allow-Origin", "*");
            res.set_content("{\"error\":\"Missing data\"}", "application/json");
            return;
        }

        int id = stoi(req.get_param_value("id"));
        string value = req.get_param_value("value");

        sqlite3 *db;
        sqlite3_open("cache.db", &db);

        string query = "UPDATE data_store SET value = '" + value + "' WHERE id = " + to_string(id);
        sqlite3_exec(db, query.c_str(), 0, 0, 0);

        sqlite3_close(db);

        cache = LRUCache(3); // reset cache

        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_content("{\"message\":\"Updated\"}", "application/json");
    });

    cout << "Server running at http://localhost:8080\n";
    svr.listen("localhost", 8080);
}