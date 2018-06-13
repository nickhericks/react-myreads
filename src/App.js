import React from 'react'
import { Route } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import './App.css'
import ListBooks from './ListBooks'
import SearchBooks from './SearchBooks'


class BooksApp extends React.Component {
  state = {
    books: []
  }

  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({ books: books })
    })
  }

  moveBook = (book, shelf) => {
    BooksAPI.update(book, shelf)
    .then(() => {
      book.shelf = shelf;
      // Filter out the book from state
      // Add it back to state so it is added to end of correct shelf
      this.setState(state => ({
          books: state.books.filter(b => b.id !== book.id).concat([ book ])
      }));
    });
    console.log(book, shelf)
  }



  render() {
    return (
      <div className="app">

        <Route exact path="/" render={() => (
          <ListBooks
            books={this.state.books}
            onMoveBook={this.moveBook}
          />
        )}/>
        <Route path="/search" render={({ history }) => (
          <SearchBooks
            books={this.state.books}
            onMoveBook={this.moveBook}
          />
        )}/>
      </div>
    )
  }
}
export default BooksApp
