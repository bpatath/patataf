import { SyntheticEvent, RefObject, useEffect, useState } from "react";
import { List } from "immutable";

export function useOnClickOutside<T extends HTMLElement>(
  ref: RefObject<T>,
  callback: () => void
): void {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(<HTMLElement | null>event.target)
      ) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
}

export function useDebounced<Arg = void>(
  callback: (arg: Arg) => void,
  delay?: number
): (arg: Arg) => void {
  const [timer, setTimer] = useState<number | null>(null);
  return (arg: Arg) => {
    if (timer != null) clearTimeout(timer);
    setTimer(
      setTimeout(() => {
        callback(arg);
      }, delay)
    );
  };
}

export function useTextInput(
  defaultValue?: string
): [string, (event: SyntheticEvent<HTMLInputElement>) => void] {
  const [value, setValue] = useState(defaultValue || "");
  const onChange = (event: SyntheticEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
    event.stopPropagation();
  };
  return [value, onChange];
}

export function useCheckboxInput(
  defaultValue?: boolean
): [boolean, (event: SyntheticEvent<HTMLInputElement>) => void] {
  const [value, setValue] = useState(defaultValue || false);
  const onChange = (event: SyntheticEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.checked);
    event.stopPropagation();
  };
  return [value, onChange];
}

export function useDebouncedSearchInput(
  onSearch: (searchQuery: string) => void,
  delay: number,
  defaultValue?: string
): [string, (event: SyntheticEvent<HTMLInputElement>) => void] {
  const [value, setValue] = useState(defaultValue || "");
  const search = useDebounced((value: string) => {
    onSearch(value);
  }, delay);
  const onChange = (event: SyntheticEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
    search(event.currentTarget.value);
  };
  return [value, onChange];
}

export function useInputValues<V>(): [
  V[],
  (value: V) => void,
  (i: number) => void
] {
  const [values, setValues] = useState(List<V>());
  const addValue = (value: V) => {
    setValues(values.push(value));
  };
  const removeValue = (i: number) => {
    setValues(values.delete(i));
  };
  return [values.toArray(), addValue, removeValue];
}
