import React, { useState } from 'react';
import { TextInputProps } from 'react-native';
import { View, Text, TextInput, Pressable } from '@/tw';

export interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  secureTextEntry?: boolean;
  className?: string;
}

export function Input({
  label,
  error,
  secureTextEntry = false,
  className = '',
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [obscured, setObscured] = useState(secureTextEntry);

  let borderStyles = 'border-surface-border ';
  if (focused) {
    borderStyles = 'border-accent-terracotta ';
  } else if (error) {
    borderStyles = 'border-destructive ';
  }

  return (
    <View className={`w-full ${className}`}>
      <Text className="text-secondary-text font-sans text-xs mb-2 uppercase tracking-widest">
        {label}
      </Text>
      <View className={`w-full bg-surface border rounded-xl flex-row items-center overflow-hidden ${borderStyles}`}>
        <TextInput
          className="flex-1 py-3 px-4 text-primary-text font-sans text-base"
          placeholderTextColor="#A69580"
          secureTextEntry={obscured}
          onFocus={(e) => {
            setFocused(true);
            if (props.onFocus) props.onFocus(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            if (props.onBlur) props.onBlur(e);
          }}
          {...props}
        />
        {secureTextEntry && (
          <Pressable
            className="px-4 py-3 active:opacity-75"
            onPress={() => setObscured((prev) => !prev)}
          >
            <Text className="text-secondary-text font-sans text-xs uppercase tracking-widest font-bold">
              {obscured ? 'Show' : 'Hide'}
            </Text>
          </Pressable>
        )}
      </View>
      {error && (
        <Text className="text-destructive font-sans text-xs mt-1.5 font-medium">
          {error}
        </Text>
      )}
    </View>
  );
}
