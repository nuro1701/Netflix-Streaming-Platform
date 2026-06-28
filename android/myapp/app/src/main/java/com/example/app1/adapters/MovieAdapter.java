package com.example.app1.adapters;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.bumptech.glide.Glide;
import com.example.app1.MovieInfoActivity;
import com.example.app1.R;
import com.example.app1.entities.Movie;
import java.util.List;

public class MovieAdapter extends RecyclerView.Adapter<MovieAdapter.MovieViewHolder> {
    private List<Movie> movies;
    private Context context;

    public MovieAdapter(List<Movie> movies, Context context) {
        this.movies = movies;
        this.context = context;
    }

    @NonNull
    @Override
    public MovieViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_movie, parent, false);
        return new MovieViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull MovieViewHolder holder, int position) {
        Movie movie = movies.get(position);

        // Bind movie data to views
        holder.nameTextView.setText(movie.getName());
        holder.yearTextView.setText(String.valueOf(movie.getYear()));
        Glide.with(context)
                .load(movie.getPoster())
                .override(120, 180) // Set image size
                .into(holder.posterImageView);

        // Set click listener for movie item
        holder.posterImageView.setOnClickListener(v -> {
            // Create an intent to navigate to MovieInfoActivity
            Intent intent = new Intent(context, MovieInfoActivity.class);

            // Pass movie data, including the trailer URL
            intent.putExtra("movie_name", movie.getName());
            intent.putExtra("movie_year", movie.getYear());
            intent.putExtra("movie_poster", movie.getPoster());
            intent.putExtra("movie_description", movie.getDescription());
            intent.putExtra("movie_director", movie.getDirector());
            intent.putExtra("movie_genre", movie.getGenre());
            intent.putExtra("movie_rating", movie.getRating());
            intent.putExtra("movie_trailer", movie.getTrailer()); // Pass the trailer URL
            intent.putExtra("movie_length", movie.getLength());
            intent.putExtra("movie_age_restriction", movie.getAgeRestriction());

            // Start the activity
            context.startActivity(intent);
        });
    }


    @Override
    public int getItemCount() {
        return movies.size();
    }

    public class MovieViewHolder extends RecyclerView.ViewHolder {
        TextView nameTextView, yearTextView;
        ImageView posterImageView;

        public MovieViewHolder(View itemView) {
            super(itemView);
            nameTextView = itemView.findViewById(R.id.movie_name);
            yearTextView = itemView.findViewById(R.id.movie_year);
            posterImageView = itemView.findViewById(R.id.movie_poster);
        }
    }
}
