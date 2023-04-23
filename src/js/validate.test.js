import Validator from "./validate";

test("Тест на валидацию координат успешный", () => {
  const coords = "68.419887, 127.613923";
  const result = Validator.geoValidate(coords);
  expect(result).toBe(true);
});

test("Тест на валидацию координат ошибка", () => {
  const coords = "68419887, 127613923";
  const result = Validator.geoValidate(coords);
  expect(result).toBe(false);
});
