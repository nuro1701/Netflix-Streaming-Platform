package com.example.app1;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.webkit.WebView;
import android.widget.MediaController;
import com.bumptech.glide.Glide;
import androidx.appcompat.app.AppCompatActivity;

public class MovieInfoActivity extends AppCompatActivity {
    private TextView movieName, movieYear, movieDirector, movieGenre, movieRating,
            movieDescription, movieLength, movieAgeRestriction;
    private ImageView moviePoster;
    private Button watchTrailerButton;
    private WebView trailerWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_movie_info);

        // Initialize UI components
        movieName = findViewById(R.id.movie_name);
        movieYear = findViewById(R.id.movie_year);
        movieDirector = findViewById(R.id.movie_director);
        movieGenre = findViewById(R.id.movie_genre);
        movieRating = findViewById(R.id.movie_rating);
        movieDescription = findViewById(R.id.movie_description);
        movieLength = findViewById(R.id.movie_length);
        movieAgeRestriction = findViewById(R.id.movie_age_restriction);
        moviePoster = findViewById(R.id.movie_poster);
        watchTrailerButton = findViewById(R.id.watch_trailer_button);
        trailerWebView = findViewById(R.id.movie_trailer_webview);

        Intent intent = getIntent();
        if (intent != null) {
            // Set text data
            movieName.setText(intent.getStringExtra("movie_name"));
            movieYear.setText("Year: " + intent.getIntExtra("movie_year", 0));
            movieDirector.setText("Director: " + intent.getStringExtra("movie_director"));
            movieGenre.setText("Genre: " + intent.getStringExtra("movie_genre"));
            movieRating.setText("Rating: " + intent.getFloatExtra("movie_rating", 0.0f));
            movieDescription.setText(intent.getStringExtra("movie_description"));
            movieLength.setText("Length: " + intent.getIntExtra("movie_length", 0) + " min");
            movieAgeRestriction.setText("Age Restriction: " + intent.getIntExtra("movie_age_restriction", 0) + "+");

            Glide.with(this)
                    .load(intent.getStringExtra("movie_poster"))
                    .into(moviePoster);

            String trailerUrl = intent.getStringExtra("movie_trailer");
            if (trailerUrl != null && !trailerUrl.isEmpty()) {

                String videoId = extractVideoId(trailerUrl);
                String embedUrl = "https://www.youtube.com/embed/" + videoId;

                trailerWebView.getSettings().setJavaScriptEnabled(true);
                trailerWebView.loadUrl(embedUrl);
            }
        }
    }

    private String extractVideoId(String url) {
        String videoId = "";
        if (url != null) {
            if (url.contains("youtube.com")) {
                // YouTube URL with video ID
                videoId = Uri.parse(url).getQueryParameter("v");
            } else if (url.contains("youtu.be")) {
                // Shortened YouTube URL
                videoId = url.substring(url.lastIndexOf("/") + 1);
            }
        }
        return videoId;
    }
}
