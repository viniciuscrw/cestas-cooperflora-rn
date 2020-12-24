import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import SearchBar from '../components/SearchBar';
import useResults from '../hooks/useResults';
import ResultsList from '../components/ResultsList';

const SearchScreen = () => {
  const [term, setTerm] = useState('');
  const [searchApi, results, errorMessage] = useResults();

  const filterResultByPrice = (price) => {
    return results.filter((result) => {
      return result.price === price;
    });
  };

  return (
    // <View style={{ flex: 1 }}>
    <>
      <SearchBar
        term={term}
        onTermChange={setTerm}
        onTermSubmit={() => searchApi(term)}
      />
      {errorMessage ? <Text>{errorMessage}</Text> : null}
      <ScrollView>
        <ResultsList
          title="Cost Effective"
          results={filterResultByPrice('$')}
        />
        <ResultsList title="Bit Pricier" results={filterResultByPrice('$$')} />
        <ResultsList title="Big Spender" results={filterResultByPrice('$$$')} />
      </ScrollView>
      {/*</View>*/}
    </>
  );
};

const styles = StyleSheet.create({});

export default SearchScreen;
