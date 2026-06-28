package com.example.app1.entities;

import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "movies")
public class Movie {
    @PrimaryKey(autoGenerate = true)
    private int id;
    private String name;
    private int year;
    private String director;
    private String genre;
    private Float rating;
    private String description;
    private String poster;
    private String trailer;
    private int length;
    private int ageRestriction;

    // Constructor for creating a Movie from the API response
    public Movie(String name, int year, String director, String genre, Float rating, String description, String poster, String trailer, int length, int ageRestriction) {
        this.name = name;
        this.year = year;
        this.director = director;
        this.genre = genre;
        this.rating = rating;
        this.description = description;
        this.poster = poster;
        this.trailer = trailer;
        this.length = length;
        this.ageRestriction = ageRestriction;
    }

    // Getters and setters for each field
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }
    public String getDirector() { return director; }
    public void setDirector(String director) { this.director = director; }
    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }
    public Float getRating() { return rating; }
    public void setRating(Float rating) { this.rating = rating; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getPoster() { return poster; }
    public void setPoster(String poster) { this.poster = poster; }
    public String getTrailer() { return trailer; }
    public void setTrailer(String trailer) { this.trailer = trailer; }
    public int getLength() { return length; }
    public void setLength(int length) { this.length = length; }
    public int getAgeRestriction() { return ageRestriction; }
    public void setAgeRestriction(int ageRestriction) { this.ageRestriction = ageRestriction; }
}
