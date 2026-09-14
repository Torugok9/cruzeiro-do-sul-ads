const cpf = document.querySelector('#cpf');
const telefone = document.querySelector('#telefone');
const cep = document.querySelector('#cep');
const formulario = document.querySelector('#formulario-voluntario');

function apenasDigitos(valor) {
  return valor.replace(/\D/g, '');
}

cpf.addEventListener('input', () => {
  let valor = apenasDigitos(cpf.value).slice(0, 11);
  valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
  valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
  valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  cpf.value = valor;
});

telefone.addEventListener('input', () => {
  let valor = apenasDigitos(telefone.value).slice(0, 11);
  valor = valor.replace(/^(\d{2})(\d)/, '($1) $2');
  valor = valor.replace(/(\d{5})(\d{4})$/, '$1-$2');
  valor = valor.replace(/(\d{4})(\d{4})$/, '$1-$2');
  telefone.value = valor;
});

cep.addEventListener('input', () => {
  let valor = apenasDigitos(cep.value).slice(0, 8);
  valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
  cep.value = valor;
});

function cpfValido(valor) {
  const numeros = apenasDigitos(valor);
  if (numeros.length !== 11 || /^([0-9])\1{10}$/.test(numeros)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += Number(numeros[i]) * (10 - i);
  let digito = (soma * 10) % 11;
  if (digito === 10) digito = 0;
  if (digito !== Number(numeros[9])) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += Number(numeros[i]) * (11 - i);
  digito = (soma * 10) % 11;
  if (digito === 10) digito = 0;
  return digito === Number(numeros[10]);
}

formulario.addEventListener('submit', (evento) => {
  if (!cpfValido(cpf.value)) {
    evento.preventDefault();
    cpf.setCustomValidity('Informe um CPF válido.');
    cpf.reportValidity();
  } else {
    cpf.setCustomValidity('');
  }
});

cpf.addEventListener('input', () => cpf.setCustomValidity(''));
