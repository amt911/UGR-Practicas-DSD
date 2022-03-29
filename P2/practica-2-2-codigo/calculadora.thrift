service Calculadora{
   double suma(1:double num1, 2:double num2),
   double resta(1:double num1, 2:double num2),
   double mult(1:double a, 2:double b),
   double division(1:double a, 2:double b),
   i32 modulo(1:i32 dividendo, 2:i32 divisor),
   double raiz_cuadrada(1:double a),
   double logaritmo(1:i32 a, 2:i32 b),
   bool es_primo(1:i32 a),
   i32 potencia(1:i32 base, 2:i32 exp),
   i32 factorial(1:i32 a),
   list<list<double>> suma_matricial(1:list<list<double>> a, 2:list<list<double>> b),
   list<list<double>> resta_matricial(1:list<list<double>> a, 2:list<list<double>> b),
   list<list<double>> mult_matricial(1:list<list<double>> a, 2:list<list<double>> b),
   list<list<double>> traspuesta(1:list<list<double>> a),
   double determinante_matriz(1:list<list<double>> a),
   double resolver_ecuaciones(1:string cadena, 2:double eq),
   double multiples_comandos(1:string cadena)
}
