import React, {Component} from "react";
import {StyleSheet,Text,View,Image} from "react-native";
import { SectionGrid } from "react-native-super-grid";
import SearchBar from "../components/SearchBar";
import { commonStyles } from '../style/CommonStyle';

let SQLite = require('react-native-sqlite-storage');


export default class MenuScreen extends Component{
    constructor(props){
        super(props);
        this.state = {
            items: [],
            fake_items: [
                { name: 'Americano', code: '#a67c52' },
                { name: 'Latte', code: '#6b3e1a' },
                { name: 'Cappuccino', code: '#be8f68' },
                { name: 'Espresso', code: '#3a1c0f' },
                { name: 'Mocha', code: '#7d5235' },
                { name: 'Macchiato', code: '#c19776' },
                { name: 'Flat White', code: '#b59060' },
                { name: 'Irish Coffee', code: '#8e5b29' },
                { name: 'Café au Lait', code: '#bc9060' },
                { name: 'Café Bombón', code: '#6e4a1f' },
                { name: 'Café con Leche', code: '#94602e' },
                { name: 'Café Cubano', code: '#6f4c25' },
                { name: 'Turkish Coffee', code: '#612e0a' },
                { name: 'Cold Brew', code: '#3d2111' },
                { name: 'Nitro Coffee', code: '#1d0d05' },
                { name: 'Vienna Coffee', code: '#7f5747' },
                { name: 'Affogato', code: '#7d5f3c' },
                { name: 'Ristretto', code: '#27150c' },
                { name: 'Long Black', code: '#a5714c' },
                { name: 'Cortado', code: '#9e6d3f' },
            ],
            searchPhrase: "",
            clicked: false,
            fakeData: undefined,
        };
        handleSearchPhraseChange = (newSearchPhrase) => {
            this.setState({
              searchPhrase: newSearchPhrase,
            });
        };
        setClicked = (isClicked) => {
            this.setState({
              clicked: isClicked,
            });
        };

        this._query = this._query.bind(this);
        this.db = SQLite.openDatabase(
            {name: 'coffeeDatabase'},
            this.openCallback,
            this.errorCallback,
        )
    }
    componentDidMount(){
        this._query();
    }
    _query(){
        this.db.transaction(tx =>
            tx.executeSql('SELECT * FROM items', [], (tx, results) => {
                const itemsArray = [];
                for (let i = 0; i < results.rows.length; i++) {
                    const item = results.rows.item(i);
                    const { id, name, description, base_price: price } = item;
                    itemsArray.push({ id, name, desc: description, price });
                }
                this.setState({
                    items: itemsArray
                }, () => {
                    console.log(this.state.items); // Debug purpose
                });
            }
            ));
    }
    openCallback(){
        console.log('database open success');
    }
    errorCallback(err){
        console.log('Error in opening database :' + err);
    }
    render(){
       
        return(
            <View style={commonStyles.container}>
            <View style={commonStyles.searchBarContainer}>
            <SearchBar
                searchPhrase={this.state.searchPhrase}
                setSearchPhrase={this.handleSearchPhraseChange}
                clicked={this.state.clickedclicked}
                setClicked={this.setClicked}
            />
            </View>
            <SectionGrid
                itemDimension={120}
                sections={[
                    {
                    title: 'Classics',
                    data: this.state.items,
                    },
                    
                    {
                    title: 'Specialties',
                    data: this.state.fake_items.slice(4, 8),
                    },
                    {
                    title: 'Unique Brews',
                    data: this.state.fake_items.slice(8, 12),
                    },
                    {
                    title: 'Iced Delights',
                    data: this.state.fake_items.slice(12, 16),
                    },
                    {
                    title: 'Short and Strong',
                    data: this.state.fake_items.slice(16, 20),
                    },
                    
                ]}
                style={commonStyles.gridView}
                renderItem={({ item, section, index }) => (
                    <View style={[commonStyles.itemContainer]}>
                        
                         <Image
                            source={require('../assets/CoffeeImage/Americano.png')} // Update the path accordingly
                            style={{ width: 50, height:100 ,alignSelf: 'center'}}
                        />
                    <Text style={commonStyles.itemName}>{item.name}</Text>
                    </View>
                )}
                renderSectionHeader={({ section }) => (
                    <Text style={commonStyles.sectionHeader}>{section.title}</Text>
                )}
                />
                </View>
  );
}
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    text: {
      fontSize: 25,
      fontWeight: '500',
      textAlign : 'center',
    },
    gridView: {
        marginTop: 20,
        flex: 1,
    },
    itemContainer: 
    {
        justifyContent: 'flex-end',
        borderRadius: 5,
        padding: 10,
        height: 150,
    },
    itemName: 
    {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    itemCode: 
    {
        fontWeight: '600',
        fontSize: 12,
        color: '#fff',
    },
    sectionHeader: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        alignItems: 'center',
        backgroundColor: '#0f4c81',
        color: 'white',
        padding: 10,
    },
})
