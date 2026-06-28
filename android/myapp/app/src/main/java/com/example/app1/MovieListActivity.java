package com.example.app1;

import android.os.Bundle;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.example.app1.adapters.MovieAdapter;
import com.example.app1.adapters.SpacesItemDecoration;
import com.example.app1.api.ApiService;
import com.example.app1.api.RetrofitClient;
import com.example.app1.entities.Movie;
import java.util.List;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MovieListActivity extends AppCompatActivity {
    private RecyclerView recyclerView;
    private MovieAdapter movieAdapter;
    private ApiService apiService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_movie_list);

        recyclerView = findViewById(R.id.recyclerViewMovies);

        GridLayoutManager layoutManager = new GridLayoutManager(this, 3);
        recyclerView.setLayoutManager(layoutManager);

        apiService = RetrofitClient.getApiService();
        fetchMovies();
    }


    private void fetchMovies() {
        try {
            apiService.getMovies().enqueue(new Callback<List<Movie>>() {
                @Override
                public void onResponse(@NonNull Call<List<Movie>> call,
                                       @NonNull Response<List<Movie>> response) {
                    if (response.isSuccessful() && response.body() != null) {
                        movieAdapter = new MovieAdapter(response.body(),
                                MovieListActivity.this);
                        recyclerView.setAdapter(movieAdapter);
                    } else {
                        Toast.makeText(MovieListActivity.this, "Failed to load movies",
                                Toast.LENGTH_SHORT).show();
                    }
                }

                @Override
                public void onFailure(@NonNull Call<List<Movie>> call, @NonNull Throwable t) {
                    Toast.makeText(MovieListActivity.this, "Network Error: " +
                            t.getMessage(), Toast.LENGTH_LONG).show();
                    t.printStackTrace();
                }
            });
        } catch (Exception e) {
            Toast.makeText(MovieListActivity.this, "Unexpected Error: " +
                    e.getMessage(), Toast.LENGTH_LONG).show();
            e.printStackTrace();
        }
    }

}