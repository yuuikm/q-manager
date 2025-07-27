import { type FC } from 'react';
import { Link } from 'react-router-dom';

type ButtonProps = {
  link?: string;
  text: string;
  type: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
};

const Button: FC<ButtonProps> = ({ link, text, type, onClick }) => {
  const baseStyles = 'px-4 py-2 rounded-lg text-sm font-medium transition duration-300';

  let typeStyles = '';
  switch (type) {
    case 'primary':
      typeStyles = 'bg-blue-600 hover:bg-blue-700 text-white';
      break;
    case 'secondary':
      typeStyles = 'bg-gray-100 hover:bg-gray-200 text-gray-800';
      break;
    case 'outline':
      typeStyles =
        'bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white';
      break;
  }

  const className = `${baseStyles} ${typeStyles}`;

  if (link) {
    return (
      <Link to={link} className={className}>
        {text}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {text}
    </button>
  );
};

export default Button;
