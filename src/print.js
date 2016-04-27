export default function print(...chunks) {
  process.stdout.write(chunks.join(' ') + '\n');
}