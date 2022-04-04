service Calculadora{
   double suma(1:double num1, 2:double num2),
   double resta(1:double num1, 2:double num2),
   double mult(1:double a, 2:double b),
   double division(1:double a, 2:double b),
   i64 modulo(1:i64 dividendo, 2:i64 divisor),
   double raiz_cuadrada(1:double a),
   double logaritmo(1:i64 a, 2:i64 b),
   bool es_primo(1:i64 a),
   i64 potencia(1:i64 base, 2:i64 exp),
   i64 factorial(1:i64 a),
   list<list<double>> suma_matricial(1:list<list<double>> a, 2:list<list<double>> b),
   list<list<double>> resta_matricial(1:list<list<double>> a, 2:list<list<double>> b),
   list<list<double>> mult_matricial(1:list<list<double>> a, 2:list<list<double>> b),
   list<list<double>> traspuesta(1:list<list<double>> a),
   string biseccion(1:string ecuacion, 2:double error, 3:double inf, 4:double sup),
   double multiples_comandos(1:string cadena, 2:double x)
}
