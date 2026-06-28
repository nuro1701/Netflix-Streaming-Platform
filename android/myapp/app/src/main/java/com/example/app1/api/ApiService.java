package com.example.app1.api;

import com.example.app1.entities.Movie;
import com.example.app1.entities.User;
import com.example.app1.entities.Token;
import java.util.List;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Header;
import retrofit2.http.Path;

public interface ApiService {

    // Get all movies
    @GET("movies/all")
    Call<List<Movie>> getMovies();

    // Get a specific movie by ID
    @GET("movies/:id")
    Call<Movie> getMovieById(@Path("id") int id);

    // User login (returns JWT token)
    @POST("tokens")
    Call<Token> login(@Body User user);

    // Get user details
    @GET("users/:id")
    Call<User> getUser(@Header("Authorization") String token);
}
