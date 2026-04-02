import React, { useRef, useCallback } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Animated,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDebounce } from '../hooks/useDebounce';
import { useTheme } from '../../../store/ThemeContext';

interface Props {
  onSearch: (q: string) => void;
  filterCount: number;
  onFilterPress: () => void;
}

export function SearchBar({ onSearch, filterCount, onFilterPress }: Props) {
  const { colors } = useTheme();
  const inputRef    = useRef<TextInput>(null);
  const [value, setValue] = React.useState('');
  const scale       = useRef(new Animated.Value(1)).current;

  // ── Debounced search – fires 300 ms after the user stops typing
  const debouncedSearch = useDebounce(onSearch, 300);

  const handleChange = useCallback((text: string) => {
    setValue(text);
    debouncedSearch(text);
  }, [debouncedSearch]);

  const handleClear = useCallback(() => {
    setValue('');
    onSearch('');
    inputRef.current?.clear();
  }, [onSearch]);

  const animateIn  = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const animateOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

  return (
    <View style={[s.wrapper, { backgroundColor: colors.bgBase }]}>
      {/* Search input */}
      <Animated.View style={[s.inputWrap, { backgroundColor: colors.bgCard, borderColor: colors.borderCard, transform: [{ scale }] }]}>
        <MaterialCommunityIcons name="magnify" size={18} color={colors.textMuted} style={s.searchIcon} />
        <TextInput
          ref={inputRef}
          style={[s.input, { color: colors.textPrimary }]}
          placeholder="Search transactions…"
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={handleChange}
          onFocus={animateIn}
          onBlur={animateOut}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={handleClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <MaterialCommunityIcons name="close-circle" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Filter button */}
      <TouchableOpacity style={[s.filterBtn, { backgroundColor: colors.bgCard, borderColor: colors.borderCard }]} onPress={onFilterPress} activeOpacity={0.8}>
        <MaterialCommunityIcons name="filter-variant" size={20} color={filterCount > 0 ? colors.accent : colors.textMuted} />
        {filterCount > 0 && (
          <View style={[s.badge, { backgroundColor: colors.accent }]}>
            <Text style={s.badgeText}>{filterCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
  },
});

