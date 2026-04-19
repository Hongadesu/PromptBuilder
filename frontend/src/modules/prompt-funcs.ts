const TEMPLATE_KEY_PATTERN = '[a-zA-Z_][a-zA-Z0-9_]*';
const TEMPLATE_KEY_REGEX = new RegExp(`^${TEMPLATE_KEY_PATTERN}$`);
const TEMPLATE_PLACEHOLDER_REGEX = new RegExp(
  `\\$\\{(${TEMPLATE_KEY_PATTERN})\\}`,
  'gu',
);

/**
 * 判斷擷取出來的 key 是否合法
 * (僅允許字母、數字和下劃線，且不能以數字開頭)
 * @param key
 */
export function checkKeyValid(key: string): boolean {
  return TEMPLATE_KEY_REGEX.test(key);
}

/**
 * 將提示詞模板中的 key 提取出來
 * (key 僅允許字母、數字和下劃線，且不能以數字開頭)
 * @param template
 *
 * @example
 * ```typescript
 * const template = '${input}\n請強化這段話的語氣';
 * const keys = extractKeys(template);
 * console.log(keys);  // ['input']
 * ```
 */
export function extractKeys(template: string): string[] {
  const keys = new Set<string>();
  const matches = template.matchAll(TEMPLATE_PLACEHOLDER_REGEX);

  for (const match of matches) {
    const key = match[1];
    // TODO: 這邊需要檢查 key 是不是合法，他這個 string 不應該包含 ".,)({}:" 其中任意字符
    const isValid = checkKeyValid(key);

    if (isValid) {
      keys.add(key);
    } else {
      throw new Error(`Invalid key: ${key}`);
    }
  }

  return [...keys];
}

/**
 * 將提示詞模板轉成函數
 * @param template
 * @param keys
 *
 * @example
 * ```typescript
 * const template = '${input}\n請強化這段話的語氣';
 * const keys = ['input'];
 * const values = ['你好'];
 * const fn = generateFunction(template, keys);
 * console.log(fn(...values));  // '你好\n請強化這段話的語氣'
 * ```
 */
export function generateFunction(template: string, keys: string[]) {
  return (...values: string[]) => {
    const map = Object.fromEntries(keys.map((k, i) => [k, values[i]]));
    return template.replace(/\$\{(\w+)\}/g, (_, k) => map[k] ?? '');
  };
}

// export function generateFunction(
//   template: string,
//   keys: string[],
// ): (...values: string[]) => string {
//   const fnArgs = keys.join(', ');
//   const fnBody = `return \`${template}\`;`;
//   const fn = new Function(fnArgs, fnBody);
//   return fn as (...values: string[]) => string;
// }
