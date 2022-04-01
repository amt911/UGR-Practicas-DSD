#
# Autogenerated by Thrift Compiler (0.16.0)
#
# DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
#

require 'thrift'
require 'calculadora_types'

module Calculadora
  class Client
    include ::Thrift::Client

    def suma(num1, num2)
      send_suma(num1, num2)
      return recv_suma()
    end

    def send_suma(num1, num2)
      send_message('suma', Suma_args, :num1 => num1, :num2 => num2)
    end

    def recv_suma()
      result = receive_message(Suma_result)
      return result.success unless result.success.nil?
      raise ::Thrift::ApplicationException.new(::Thrift::ApplicationException::MISSING_RESULT, 'suma failed: unknown result')
    end

    def resta(num1, num2)
      send_resta(num1, num2)
      return recv_resta()
    end

    def send_resta(num1, num2)
      send_message('resta', Resta_args, :num1 => num1, :num2 => num2)
    end

    def recv_resta()
      result = receive_message(Resta_result)
      return result.success unless result.success.nil?
      raise ::Thrift::ApplicationException.new(::Thrift::ApplicationException::MISSING_RESULT, 'resta failed: unknown result')
    end

    def mult(a, b)
      send_mult(a, b)
      return recv_mult()
    end

    def send_mult(a, b)
      send_message('mult', Mult_args, :a => a, :b => b)
    end

    def recv_mult()
      result = receive_message(Mult_result)
      return result.success unless result.success.nil?
      raise ::Thrift::ApplicationException.new(::Thrift::ApplicationException::MISSING_RESULT, 'mult failed: unknown result')
    end

    def division(a, b)
      send_division(a, b)
      return recv_division()
    end

    def send_division(a, b)
      send_message('division', Division_args, :a => a, :b => b)
    end

    def recv_division()
      result = receive_message(Division_result)
      return result.success unless result.success.nil?
      raise ::Thrift::ApplicationException.new(::Thrift::ApplicationException::MISSING_RESULT, 'division failed: unknown result')
    end

    def modulo(dividendo, divisor)
      send_modulo(dividendo, divisor)
      return recv_modulo()
    end

    def send_modulo(dividendo, divisor)
      send_message('modulo', Modulo_args, :dividendo => dividendo, :divisor => divisor)
    end

    def recv_modulo()
      result = receive_message(Modulo_result)
      return result.success unless result.success.nil?
      raise ::Thrift::ApplicationException.new(::Thrift::ApplicationException::MISSING_RESULT, 'modulo failed: unknown result')
    end

    def raiz_cuadrada(a)
      send_raiz_cuadrada(a)
      return recv_raiz_cuadrada()
    end

    def send_raiz_cuadrada(a)
      send_message('raiz_cuadrada', Raiz_cuadrada_args, :a => a)
    end

    def recv_raiz_cuadrada()
      result = receive_message(Raiz_cuadrada_result)
      return result.success unless result.success.nil?
      raise ::Thrift::ApplicationException.new(::Thrift::ApplicationException::MISSING_RESULT, 'raiz_cuadrada failed: unknown result')
    end

    def logaritmo(a, b)
      send_logaritmo(a, b)
      return recv_logaritmo()
    end

    def send_logaritmo(a, b)
      send_message('logaritmo', Logaritmo_args, :a => a, :b => b)
    end

    def recv_logaritmo()
      result = receive_message(Logaritmo_result)
      return result.success unless result.success.nil?
      raise ::Thrift::ApplicationException.new(::Thrift::ApplicationException::MISSING_RESULT, 'logaritmo failed: unknown result')
    end

    def es_primo(a)
      send_es_primo(a)
      return recv_es_primo()
    end

    def send_es_primo(a)
      send_message('es_primo', Es_primo_args, :a => a)
    end

    def recv_es_primo()
      result = receive_message(Es_primo_result)
      return result.success unless result.success.nil?
      raise ::Thrift::ApplicationException.new(::Thrift::ApplicationException::MISSING_RESULT, 'es_primo failed: unknown result')
    end

    def potencia(base, exp)
      send_potencia(base, exp)
      return recv_potencia()
    end

    def send_potencia(base, exp)
      send_message('potencia', Potencia_args, :base => base, :exp => exp)
    end

    def recv_potencia()
      result = receive_message(Potencia_result)
      return result.success unless result.success.nil?
      raise ::Thrift::ApplicationException.new(::Thrift::ApplicationException::MISSING_RESULT, 'potencia failed: unknown result')
    end

    def factorial(a)
      send_factorial(a)
      return recv_factorial()
    end

    def send_factorial(a)
      send_message('factorial', Factorial_args, :a => a)
    end

    def recv_factorial()
      result = receive_message(Factorial_result)
      return result.success unless result.success.nil?
      raise ::Thrift::ApplicationException.new(::Thrift::ApplicationException::MISSING_RESULT, 'factorial failed: unknown result')
    end

    def suma_matricial(a, b)
      send_suma_matricial(a, b)
      return recv_suma_matricial()
    end

    def send_suma_matricial(a, b)
      send_message('suma_matricial', Suma_matricial_args, :a => a, :b => b)
    end

    def recv_suma_matricial()
      result = receive_message(Suma_matricial_result)
      return result.success unless result.success.nil?
      raise ::Thrift::ApplicationException.new(::Thrift::ApplicationException::MISSING_RESULT, 'suma_matricial failed: unknown result')
    end

    def resta_matricial(a, b)
      send_resta_matricial(a, b)
      return recv_resta_matricial()
    end

    def send_resta_matricial(a, b)
      send_message('resta_matricial', Resta_matricial_args, :a => a, :b => b)
    end

    def recv_resta_matricial()
      result = receive_message(Resta_matricial_result)
      return result.success unless result.success.nil?
      raise ::Thrift::ApplicationException.new(::Thrift::ApplicationException::MISSING_RESULT, 'resta_matricial failed: unknown result')
    end

    def mult_matricial(a, b)
      send_mult_matricial(a, b)
      return recv_mult_matricial()
    end

    def send_mult_matricial(a, b)
      send_message('mult_matricial', Mult_matricial_args, :a => a, :b => b)
    end

    def recv_mult_matricial()
      result = receive_message(Mult_matricial_result)
      return result.success unless result.success.nil?
      raise ::Thrift::ApplicationException.new(::Thrift::ApplicationException::MISSING_RESULT, 'mult_matricial failed: unknown result')
    end

    def traspuesta(a)
      send_traspuesta(a)
      return recv_traspuesta()
    end

    def send_traspuesta(a)
      send_message('traspuesta', Traspuesta_args, :a => a)
    end

    def recv_traspuesta()
      result = receive_message(Traspuesta_result)
      return result.success unless result.success.nil?
      raise ::Thrift::ApplicationException.new(::Thrift::ApplicationException::MISSING_RESULT, 'traspuesta failed: unknown result')
    end

    def determinante_matriz(a)
      send_determinante_matriz(a)
      return recv_determinante_matriz()
    end

    def send_determinante_matriz(a)
      send_message('determinante_matriz', Determinante_matriz_args, :a => a)
    end

    def recv_determinante_matriz()
      result = receive_message(Determinante_matriz_result)
      return result.success unless result.success.nil?
      raise ::Thrift::ApplicationException.new(::Thrift::ApplicationException::MISSING_RESULT, 'determinante_matriz failed: unknown result')
    end

    def biseccion(ecuacion, error, inf, sup)
      send_biseccion(ecuacion, error, inf, sup)
      return recv_biseccion()
    end

    def send_biseccion(ecuacion, error, inf, sup)
      send_message('biseccion', Biseccion_args, :ecuacion => ecuacion, :error => error, :inf => inf, :sup => sup)
    end

    def recv_biseccion()
      result = receive_message(Biseccion_result)
      return result.success unless result.success.nil?
      raise ::Thrift::ApplicationException.new(::Thrift::ApplicationException::MISSING_RESULT, 'biseccion failed: unknown result')
    end

    def multiples_comandos(cadena, x)
      send_multiples_comandos(cadena, x)
      return recv_multiples_comandos()
    end

    def send_multiples_comandos(cadena, x)
      send_message('multiples_comandos', Multiples_comandos_args, :cadena => cadena, :x => x)
    end

    def recv_multiples_comandos()
      result = receive_message(Multiples_comandos_result)
      return result.success unless result.success.nil?
      raise ::Thrift::ApplicationException.new(::Thrift::ApplicationException::MISSING_RESULT, 'multiples_comandos failed: unknown result')
    end

  end

  class Processor
    include ::Thrift::Processor

    def process_suma(seqid, iprot, oprot)
      args = read_args(iprot, Suma_args)
      result = Suma_result.new()
      result.success = @handler.suma(args.num1, args.num2)
      write_result(result, oprot, 'suma', seqid)
    end

    def process_resta(seqid, iprot, oprot)
      args = read_args(iprot, Resta_args)
      result = Resta_result.new()
      result.success = @handler.resta(args.num1, args.num2)
      write_result(result, oprot, 'resta', seqid)
    end

    def process_mult(seqid, iprot, oprot)
      args = read_args(iprot, Mult_args)
      result = Mult_result.new()
      result.success = @handler.mult(args.a, args.b)
      write_result(result, oprot, 'mult', seqid)
    end

    def process_division(seqid, iprot, oprot)
      args = read_args(iprot, Division_args)
      result = Division_result.new()
      result.success = @handler.division(args.a, args.b)
      write_result(result, oprot, 'division', seqid)
    end

    def process_modulo(seqid, iprot, oprot)
      args = read_args(iprot, Modulo_args)
      result = Modulo_result.new()
      result.success = @handler.modulo(args.dividendo, args.divisor)
      write_result(result, oprot, 'modulo', seqid)
    end

    def process_raiz_cuadrada(seqid, iprot, oprot)
      args = read_args(iprot, Raiz_cuadrada_args)
      result = Raiz_cuadrada_result.new()
      result.success = @handler.raiz_cuadrada(args.a)
      write_result(result, oprot, 'raiz_cuadrada', seqid)
    end

    def process_logaritmo(seqid, iprot, oprot)
      args = read_args(iprot, Logaritmo_args)
      result = Logaritmo_result.new()
      result.success = @handler.logaritmo(args.a, args.b)
      write_result(result, oprot, 'logaritmo', seqid)
    end

    def process_es_primo(seqid, iprot, oprot)
      args = read_args(iprot, Es_primo_args)
      result = Es_primo_result.new()
      result.success = @handler.es_primo(args.a)
      write_result(result, oprot, 'es_primo', seqid)
    end

    def process_potencia(seqid, iprot, oprot)
      args = read_args(iprot, Potencia_args)
      result = Potencia_result.new()
      result.success = @handler.potencia(args.base, args.exp)
      write_result(result, oprot, 'potencia', seqid)
    end

    def process_factorial(seqid, iprot, oprot)
      args = read_args(iprot, Factorial_args)
      result = Factorial_result.new()
      result.success = @handler.factorial(args.a)
      write_result(result, oprot, 'factorial', seqid)
    end

    def process_suma_matricial(seqid, iprot, oprot)
      args = read_args(iprot, Suma_matricial_args)
      result = Suma_matricial_result.new()
      result.success = @handler.suma_matricial(args.a, args.b)
      write_result(result, oprot, 'suma_matricial', seqid)
    end

    def process_resta_matricial(seqid, iprot, oprot)
      args = read_args(iprot, Resta_matricial_args)
      result = Resta_matricial_result.new()
      result.success = @handler.resta_matricial(args.a, args.b)
      write_result(result, oprot, 'resta_matricial', seqid)
    end

    def process_mult_matricial(seqid, iprot, oprot)
      args = read_args(iprot, Mult_matricial_args)
      result = Mult_matricial_result.new()
      result.success = @handler.mult_matricial(args.a, args.b)
      write_result(result, oprot, 'mult_matricial', seqid)
    end

    def process_traspuesta(seqid, iprot, oprot)
      args = read_args(iprot, Traspuesta_args)
      result = Traspuesta_result.new()
      result.success = @handler.traspuesta(args.a)
      write_result(result, oprot, 'traspuesta', seqid)
    end

    def process_determinante_matriz(seqid, iprot, oprot)
      args = read_args(iprot, Determinante_matriz_args)
      result = Determinante_matriz_result.new()
      result.success = @handler.determinante_matriz(args.a)
      write_result(result, oprot, 'determinante_matriz', seqid)
    end

    def process_biseccion(seqid, iprot, oprot)
      args = read_args(iprot, Biseccion_args)
      result = Biseccion_result.new()
      result.success = @handler.biseccion(args.ecuacion, args.error, args.inf, args.sup)
      write_result(result, oprot, 'biseccion', seqid)
    end

    def process_multiples_comandos(seqid, iprot, oprot)
      args = read_args(iprot, Multiples_comandos_args)
      result = Multiples_comandos_result.new()
      result.success = @handler.multiples_comandos(args.cadena, args.x)
      write_result(result, oprot, 'multiples_comandos', seqid)
    end

  end

  # HELPER FUNCTIONS AND STRUCTURES

  class Suma_args
    include ::Thrift::Struct, ::Thrift::Struct_Union
    NUM1 = 1
    NUM2 = 2

    FIELDS = {
      NUM1 => {:type => ::Thrift::Types::DOUBLE, :name => 'num1'},
      NUM2 => {:type => ::Thrift::Types::DOUBLE, :name => 'num2'}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Suma_result
    include ::Thrift::Struct, ::Thrift::Struct_Union
    SUCCESS = 0

    FIELDS = {
      SUCCESS => {:type => ::Thrift::Types::DOUBLE, :name => 'success'}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Resta_args
    include ::Thrift::Struct, ::Thrift::Struct_Union
    NUM1 = 1
    NUM2 = 2

    FIELDS = {
      NUM1 => {:type => ::Thrift::Types::DOUBLE, :name => 'num1'},
      NUM2 => {:type => ::Thrift::Types::DOUBLE, :name => 'num2'}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Resta_result
    include ::Thrift::Struct, ::Thrift::Struct_Union
    SUCCESS = 0

    FIELDS = {
      SUCCESS => {:type => ::Thrift::Types::DOUBLE, :name => 'success'}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Mult_args
    include ::Thrift::Struct, ::Thrift::Struct_Union
    A = 1
    B = 2

    FIELDS = {
      A => {:type => ::Thrift::Types::DOUBLE, :name => 'a'},
      B => {:type => ::Thrift::Types::DOUBLE, :name => 'b'}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Mult_result
    include ::Thrift::Struct, ::Thrift::Struct_Union
    SUCCESS = 0

    FIELDS = {
      SUCCESS => {:type => ::Thrift::Types::DOUBLE, :name => 'success'}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Division_args
    include ::Thrift::Struct, ::Thrift::Struct_Union
    A = 1
    B = 2

    FIELDS = {
      A => {:type => ::Thrift::Types::DOUBLE, :name => 'a'},
      B => {:type => ::Thrift::Types::DOUBLE, :name => 'b'}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Division_result
    include ::Thrift::Struct, ::Thrift::Struct_Union
    SUCCESS = 0

    FIELDS = {
      SUCCESS => {:type => ::Thrift::Types::DOUBLE, :name => 'success'}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Modulo_args
    include ::Thrift::Struct, ::Thrift::Struct_Union
    DIVIDENDO = 1
    DIVISOR = 2

    FIELDS = {
      DIVIDENDO => {:type => ::Thrift::Types::I64, :name => 'dividendo'},
      DIVISOR => {:type => ::Thrift::Types::I64, :name => 'divisor'}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Modulo_result
    include ::Thrift::Struct, ::Thrift::Struct_Union
    SUCCESS = 0

    FIELDS = {
      SUCCESS => {:type => ::Thrift::Types::I64, :name => 'success'}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Raiz_cuadrada_args
    include ::Thrift::Struct, ::Thrift::Struct_Union
    A = 1

    FIELDS = {
      A => {:type => ::Thrift::Types::DOUBLE, :name => 'a'}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Raiz_cuadrada_result
    include ::Thrift::Struct, ::Thrift::Struct_Union
    SUCCESS = 0

    FIELDS = {
      SUCCESS => {:type => ::Thrift::Types::DOUBLE, :name => 'success'}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Logaritmo_args
    include ::Thrift::Struct, ::Thrift::Struct_Union
    A = 1
    B = 2

    FIELDS = {
      A => {:type => ::Thrift::Types::I64, :name => 'a'},
      B => {:type => ::Thrift::Types::I64, :name => 'b'}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Logaritmo_result
    include ::Thrift::Struct, ::Thrift::Struct_Union
    SUCCESS = 0

    FIELDS = {
      SUCCESS => {:type => ::Thrift::Types::DOUBLE, :name => 'success'}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Es_primo_args
    include ::Thrift::Struct, ::Thrift::Struct_Union
    A = 1

    FIELDS = {
      A => {:type => ::Thrift::Types::I64, :name => 'a'}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Es_primo_result
    include ::Thrift::Struct, ::Thrift::Struct_Union
    SUCCESS = 0

    FIELDS = {
      SUCCESS => {:type => ::Thrift::Types::BOOL, :name => 'success'}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Potencia_args
    include ::Thrift::Struct, ::Thrift::Struct_Union
    BASE = 1
    EXP = 2

    FIELDS = {
      BASE => {:type => ::Thrift::Types::I64, :name => 'base'},
      EXP => {:type => ::Thrift::Types::I64, :name => 'exp'}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Potencia_result
    include ::Thrift::Struct, ::Thrift::Struct_Union
    SUCCESS = 0

    FIELDS = {
      SUCCESS => {:type => ::Thrift::Types::I64, :name => 'success'}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Factorial_args
    include ::Thrift::Struct, ::Thrift::Struct_Union
    A = 1

    FIELDS = {
      A => {:type => ::Thrift::Types::I64, :name => 'a'}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Factorial_result
    include ::Thrift::Struct, ::Thrift::Struct_Union
    SUCCESS = 0

    FIELDS = {
      SUCCESS => {:type => ::Thrift::Types::I64, :name => 'success'}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Suma_matricial_args
    include ::Thrift::Struct, ::Thrift::Struct_Union
    A = 1
    B = 2

    FIELDS = {
      A => {:type => ::Thrift::Types::LIST, :name => 'a', :element => {:type => ::Thrift::Types::LIST, :element => {:type => ::Thrift::Types::DOUBLE}}},
      B => {:type => ::Thrift::Types::LIST, :name => 'b', :element => {:type => ::Thrift::Types::LIST, :element => {:type => ::Thrift::Types::DOUBLE}}}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Suma_matricial_result
    include ::Thrift::Struct, ::Thrift::Struct_Union
    SUCCESS = 0

    FIELDS = {
      SUCCESS => {:type => ::Thrift::Types::LIST, :name => 'success', :element => {:type => ::Thrift::Types::LIST, :element => {:type => ::Thrift::Types::DOUBLE}}}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Resta_matricial_args
    include ::Thrift::Struct, ::Thrift::Struct_Union
    A = 1
    B = 2

    FIELDS = {
      A => {:type => ::Thrift::Types::LIST, :name => 'a', :element => {:type => ::Thrift::Types::LIST, :element => {:type => ::Thrift::Types::DOUBLE}}},
      B => {:type => ::Thrift::Types::LIST, :name => 'b', :element => {:type => ::Thrift::Types::LIST, :element => {:type => ::Thrift::Types::DOUBLE}}}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Resta_matricial_result
    include ::Thrift::Struct, ::Thrift::Struct_Union
    SUCCESS = 0

    FIELDS = {
      SUCCESS => {:type => ::Thrift::Types::LIST, :name => 'success', :element => {:type => ::Thrift::Types::LIST, :element => {:type => ::Thrift::Types::DOUBLE}}}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Mult_matricial_args
    include ::Thrift::Struct, ::Thrift::Struct_Union
    A = 1
    B = 2

    FIELDS = {
      A => {:type => ::Thrift::Types::LIST, :name => 'a', :element => {:type => ::Thrift::Types::LIST, :element => {:type => ::Thrift::Types::DOUBLE}}},
      B => {:type => ::Thrift::Types::LIST, :name => 'b', :element => {:type => ::Thrift::Types::LIST, :element => {:type => ::Thrift::Types::DOUBLE}}}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Mult_matricial_result
    include ::Thrift::Struct, ::Thrift::Struct_Union
    SUCCESS = 0

    FIELDS = {
      SUCCESS => {:type => ::Thrift::Types::LIST, :name => 'success', :element => {:type => ::Thrift::Types::LIST, :element => {:type => ::Thrift::Types::DOUBLE}}}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Traspuesta_args
    include ::Thrift::Struct, ::Thrift::Struct_Union
    A = 1

    FIELDS = {
      A => {:type => ::Thrift::Types::LIST, :name => 'a', :element => {:type => ::Thrift::Types::LIST, :element => {:type => ::Thrift::Types::DOUBLE}}}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Traspuesta_result
    include ::Thrift::Struct, ::Thrift::Struct_Union
    SUCCESS = 0

    FIELDS = {
      SUCCESS => {:type => ::Thrift::Types::LIST, :name => 'success', :element => {:type => ::Thrift::Types::LIST, :element => {:type => ::Thrift::Types::DOUBLE}}}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Determinante_matriz_args
    include ::Thrift::Struct, ::Thrift::Struct_Union
    A = 1

    FIELDS = {
      A => {:type => ::Thrift::Types::LIST, :name => 'a', :element => {:type => ::Thrift::Types::LIST, :element => {:type => ::Thrift::Types::DOUBLE}}}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Determinante_matriz_result
    include ::Thrift::Struct, ::Thrift::Struct_Union
    SUCCESS = 0

    FIELDS = {
      SUCCESS => {:type => ::Thrift::Types::DOUBLE, :name => 'success'}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Biseccion_args
    include ::Thrift::Struct, ::Thrift::Struct_Union
    ECUACION = 1
    ERROR = 2
    INF = 3
    SUP = 4

    FIELDS = {
      ECUACION => {:type => ::Thrift::Types::STRING, :name => 'ecuacion'},
      ERROR => {:type => ::Thrift::Types::DOUBLE, :name => 'error'},
      INF => {:type => ::Thrift::Types::DOUBLE, :name => 'inf'},
      SUP => {:type => ::Thrift::Types::DOUBLE, :name => 'sup'}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Biseccion_result
    include ::Thrift::Struct, ::Thrift::Struct_Union
    SUCCESS = 0

    FIELDS = {
      SUCCESS => {:type => ::Thrift::Types::STRING, :name => 'success'}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Multiples_comandos_args
    include ::Thrift::Struct, ::Thrift::Struct_Union
    CADENA = 1
    X = 2

    FIELDS = {
      CADENA => {:type => ::Thrift::Types::STRING, :name => 'cadena'},
      X => {:type => ::Thrift::Types::DOUBLE, :name => 'x'}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

  class Multiples_comandos_result
    include ::Thrift::Struct, ::Thrift::Struct_Union
    SUCCESS = 0

    FIELDS = {
      SUCCESS => {:type => ::Thrift::Types::DOUBLE, :name => 'success'}
    }

    def struct_fields; FIELDS; end

    def validate
    end

    ::Thrift::Struct.generate_accessors self
  end

end

