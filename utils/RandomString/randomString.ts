export default function randomString() {
    let number = Math.random().toString();
    let array  = number.split(".");
    return array[1];
}