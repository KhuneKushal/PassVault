import PasswordGenerator from '@/components/PasswordGenerator';

export default function GeneratorPage() {
  return (
    <div className="generator-page">
      <div className="page-container">
        <h1 className="page-title">Password Generator</h1>
        <PasswordGenerator />
      </div>
    </div>
  );
}