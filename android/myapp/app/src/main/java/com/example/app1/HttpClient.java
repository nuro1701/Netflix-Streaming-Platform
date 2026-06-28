package com.example.app1;

import okhttp3.*;
import java.io.IOException;

public class HttpClient {
    private static final String BASE_URL = "http://10.0.2.2:8080/";
    private static final OkHttpClient client = new OkHttpClient();

    public void fetchMovies(Callback callback) {
        Request request = new Request.Builder()
                .url(BASE_URL + "movies/all")
                .build();

        client.newCall(request).enqueue(callback);
    }

    public static void sendData(String endpoint, String jsonData, Callback callback) {
        RequestBody body = RequestBody.create(jsonData, MediaType.get("application/json; charset=utf-8"));

        Request request = new Request.Builder()
                .url(BASE_URL + endpoint)
                .post(body)
                .build();

        client.newCall(request).enqueue(callback);
    }
}
