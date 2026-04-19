import { test, expect } from '@jest/globals';
import { extractKeys, generateFunction } from '../src/modules/prompt-funcs';

// extractKeys 測試
test('extractKeys 輸出單一模板變量', () => {
  expect(extractKeys('${input}\n請強化這段話的語氣')).toStrictEqual(['input']);
});

test('extractKeys 對重複變量輸出單一模板變量', () => {
  expect(
    extractKeys('${a} 是一段描述語句\n請強化這段話: ${a} 的語氣'),
  ).toStrictEqual(['a']);
});

test('extractKeys 正則表達檢查 - 1', () => {
  expect(
    extractKeys('這段是一段描述語句: {{{${a}} \n請強化這段話的語氣'),
  ).toStrictEqual(['a']);
});

test('extractKeys 正則表達檢查 - 2', () => {
  expect(
    extractKeys('這段是一段描述語句: {{{${{a}} \n請強化這段話的語氣'),
  ).toStrictEqual([]);
});

test('extractKeys 對多個變量輸出檢查', () => {
  expect(
    extractKeys(
      '這段是一些描述語句，分別是: \n\n(1) ${a} \n\n(2) ${b} \n\n(3) ${c} \n請強化這幾段話的語氣',
    ),
  ).toStrictEqual(['a', 'b', 'c']);
});

// generateFunction 測試
test('generateFunction 基本輸出檢查', () => {
  const template = '"${input}"\n請強化這段話的語氣';
  const keys = ['input'];
  const values = ['I like coding.'];
  const fn = generateFunction(template, keys);
  expect(fn(...values)).toBe('"I like coding."\n請強化這段話的語氣');
});

test('generateFunction 對多個變量輸出檢查', () => {
  const template =
    '這段是一些描述語句，分別是: \n\n(1) "${a}" \n\n(2) "${B}" \n\n(3) "${c}" \n請強化這幾段話的語氣';
  const keys = ['c', 'a', 'B'];
  const values = ['3', '1', '2'];
  const fn = generateFunction(template, keys);
  expect(fn(...values)).toBe(
    '這段是一些描述語句，分別是: \n\n(1) "1" \n\n(2) "2" \n\n(3) "3" \n請強化這幾段話的語氣',
  );
});

test('generateFunction 對 escape 特殊符號解析檢查', () => {
  const template =
    '這段是一些代碼片段，\n\n代碼片段:\n```\n${codeblock}\n```\n\n請解釋一下這段代碼';
  const keys = ['codeblock'];
  const values = ["console.log('hello world');"];
  const fn = generateFunction(template, keys);
  expect(fn(...values)).toBe(
    "這段是一些代碼片段，\n\n代碼片段:\n```\nconsole.log('hello world');\n```\n\n請解釋一下這段代碼",
  );
});
