# Phoenix News

## Summary

This project uses: 

1. Node and Express server
1. Mongo database 
1. Mongoose
1. Cheerio 
1. Axios
1. Good ole fashioned HTML and CSS 

The user is viewing articles that were scraped from https://www.elon.edu/e-net for the top general news articles. When the user arrives to the site, they can click the `Update News Feed` button in the navigation to ensure they have the latest articles. The articles are stored as documents within the Articles collection in MongoDB They can click an article and post a comment about the article. The comment is saved in the database as a document within the Comment collection.

Access the app live: https://radiant-citadel-45341.herokuapp.com/


## Future Enhancements

* When the article title is clicked, any comments for that article should return to the right gutter within the div `<p id="all-comments"></p>`. Currently, it is not doing that. (as of 12/15/18)

* The article link should be clickable and it needs to be wraped in an `<a>`

* Scrape additional areas from the webpage to include Sports, Faculty/Staff, and Alumni news in the feed.
