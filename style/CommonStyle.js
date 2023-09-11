import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    padding: 20,
  },
  boxContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    margin: 10,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: '#4A4A4A',
    marginBottom: 20,  // increased margin-bottom for better spacing
  },
  subtitle: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 18,
    color: '#FF6F61',
    marginBottom: 20,
  },
  bodyText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#4A4A4A',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginBottom: 10,
    paddingLeft: 10,
  },
  input: {
    fontFamily: 'Montserrat-Regular',
    flex: 1,
    height: 40, // Adjust the height value to make the input taller
    borderWidth: 0,
  },
  gridView: {
    marginTop: 20,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 10,
    height: 150,
    borderWidth: 1,
    borderColor: '#43a047',
  },
  itemName: {
    fontFamily: 'Lora-Regular',
    fontSize: 16,
    color: 'black',
    fontWeight: '600',
    textAlign: 'center',
  },
  itemCode: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '600',
    fontSize: 12,
    color: 'white',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '600',
    backgroundColor: '#43A047',
    color: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  primaryButton:{
    backgroundColor: '#192d4d',
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderBoxContainer: {
    backgroundColor: 'white',
    marginVertical: 5,
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orderItemContainer: {
    flexDirection: 'column',
  },
  orderItemText: {
    fontSize: 18,
    color: '#444',
    fontFamily: 'Montserrat-Regular',
    marginBottom: 5,
  },
  orderDateTimeText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    color: '#777',
  },
  orderTotalText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#333',
    marginTop: 10,
  },
  iconText: {
    marginRight: 5,
  },
});


