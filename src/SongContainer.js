import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import axios from 'axios';
import SongList from './SongList';
import CreateSongForm from './CreateSongForm';
import EditSongModal from './EditSongModal';

class SongContainer extends Component {
  constructor(props) {
    super(props);
/*
title = CharField()
    artist = CharField()
    album = CharField()
    */
    this.state = {
      songs: [],
      songToEdit: {
        title: '',
        artist: '',
        album: '',
        id: ''
      },
      showEditModal: false
    }
  }
  componentDidMount() {
    this.getSongs();
  }

  deleteSong = async (id) => {
    console.log(id);
    const deleteSongResponse = await axios.delete(
      `${process.env.REACT_APP_FLASK_API_URL}/api/v1/songs/${id}`
    );
    console.log(deleteSongResponse);
    // Now that the db has deleted our item, we need to remove it from state
    // Then make the delete request, then remove the song from the state array using filter
    this.setState({ songs: this.state.songs.filter((song) => song.id !== id) });

    console.log(deleteSongResponse, ' response from Flask server');
  };

  handleEditChange = (e) => {
    this.setState({
      songToEdit: {
        ...this.state.songToEdit,
        [e.currentTarget.name]: e.currentTarget.value,
      },
    });
  };
  openAndEdit = (songFromTheList) => {
    console.log(songFromTheList, ' songToEdit  ');
  
    this.setState({
      showEditModal: true,
      songToEdit: {
        ...songFromTheList,
      },
    });
  };

  addSong = async (e, song) => {
    e.preventDefault();
    console.log(song);

    try {
      // The CreateSongResponse variable will store the response from the Flask API
      const createdSongResponse = await axios.post(
        process.env.REACT_APP_FLASK_API_URL + '/api/v1/songs/',
        song
      );

      // we are emptying all the songs that are living in state into a new array,
      // and then adding the song we just created to the end of it
      // the new song which is called parsedResponse.data

      console.log(createdSongResponse.data.data, ' this is response');
      this.setState({
        songs: [...this.state.songs, createdSongResponse.data.data],
      });
    } catch (err) {
      console.log('error', err);
    }
  };

  getSongs = async () => {
    try {
      const parsedSongs = await axios(
        process.env.REACT_APP_FLASK_API_URL + '/api/v1/songs/'
      );
      console.log(parsedSongs.data.data);
      await this.setState({
        songs: parsedSongs.data.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  editModal = () =>{
    console.log('Vaishali Edit Modal')
    this.setState({
      showEditModal:false,
    })
  }
  closeAndEdit = async (e) => {
    e.preventDefault();
    try {
      const editResponse = await axios.put(
        process.env.REACT_APP_FLASK_API_URL +
          '/api/v1/songs/' +
          this.state.songToEdit.id,
        this.state.songToEdit
      );
  
      console.log(editResponse, ' parsed edit');
  
      const newSongArrayWithEdit = this.state.songs.map((song) => {
        if (song.id === editResponse.data.data.id) {
          song = editResponse.data.data;
        }
  
        return song;
      });
  
      this.setState({
        showEditModal: false,
        songs: newSongArrayWithEdit,
      });
    } catch (err) {
      console.log(err);
    }
  };  

  render() {
    return (

      <Grid columns={2} divided textAlign='center' style={{ height: '100%' }} verticalAlign='top' stackable>
        <Grid.Row>
          <Grid.Column>
            <SongList songs={this.state.songs} deleteSong={this.deleteSong} openAndEdit={this.openAndEdit}/>
          </Grid.Column>
          <Grid.Column>
            <CreateSongForm addSong={this.addSong} />
          </Grid.Column>
          <EditSongModal 
            editModal={this.editModal}
            handleEditChange={this.handleEditChange} 
            open={this.state.showEditModal} 
            songToEdit={this.state.songToEdit} 
            closeAndEdit={this.closeAndEdit}/>          
        </Grid.Row>
      </Grid>

    )
  }
}

export default SongContainer