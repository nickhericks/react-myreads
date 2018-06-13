import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'

class SearchBooks extends Component {
    //component state
  state = {
    query: '',
    searchResults: []
  }

  //update query in state based on input field event
  updateQuery = (query) => {
    this.setState({ query: query })
    //make request to server based on query
    if (query !== '') {
      BooksAPI.search(query).then((results) => {
        console.log('Results', results)
        if (results.length === undefined) {
          this.setState({ searchResults: [] })
        } else {
          this.setState({ searchResults: results })
        }
      })
    } else {
      this.setState({ searchResults: [] })
    }
  }

  render() {
    const { books, onMoveBook } = this.props
    const { query, searchResults } = this.state
    // console.log('Props', this.props)
    // console.log('State', this.state)

    let showingBooks
    if (query) {
      const match = new RegExp(escapeRegExp(query), 'i')
      showingBooks = searchResults.filter((result) => match.test(result.title))
      // console.log('Showing', showingBooks.length)
    } else {
      showingBooks = searchResults
      // console.log('no query', showingBooks)
    }

    //note if any book results are already on a shelf
    showingBooks.map((searchedBook) => {
      books.map((myBook) => {
        if (searchedBook.id === myBook.id) {
          searchedBook.shelf = myBook.shelf
        }
      })
    })

    //sort books alphabetically by title
    showingBooks.sort(sortBy('title'))

    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link
            to="/"
            className="close-search"
            >Close</Link>
          <div className="search-books-input-wrapper">
            <input
              type='search'
              placeholder='Search by title or author'
              value={query}
              onChange={(event) => this.updateQuery(event.target.value)}
            />
          </div>
        </div>
        <div className="search-books-results">
          <ol className='books-grid'>
            {showingBooks.map(book => (
              <li key={book.id}>
                <div className="book">
                  <div className="book-top">
                    <div className="book-cover" style={{
                        width: 128,
                        height: 193,
                        backgroundImage: `url(${
                          book.imageLinks ? book.imageLinks.thumbnail : "https://image.freepik.com/free-vector/abstract-background-with-a-3d-pattern_1319-68.jpg"})`
                    }}/>
                    <div className="book-shelf-changer">
                      <select
                        value={book.shelf ? book.shelf : 'none'}
                        onChange={(event) => onMoveBook(book, event.target.value)}
                      >
                        <option value="move" disabled>Move to...</option>
                        <option value="currentlyReading">Currently Reading</option>
                        <option value="wantToRead">Want to Read</option>
                        <option value="read">Read</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                  <div className="book-title">{book.title}</div>
                  <div className="book-authors">{book.authors}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    )
  }
}

export default SearchBooks;
