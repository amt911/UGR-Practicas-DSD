import glob
import sys
import this

from calculadora import Calculadora

from thrift.transport import TSocket
from thrift.transport import TTransport
from thrift.protocol import TBinaryProtocol
from thrift.server import TServer

import logging

logging.basicConfig(level=logging.DEBUG)

import math
class CalculadoraHandler:
    def __init__(self):
        self.log = {}

    def suma(self, num1, num2):
        return num1+num2
   
    def resta(self, num1,  num2):
        return num1-num2
   
    def mult(self, a,  b):
        return a*b
    
    def division(self, a,  b):
        return a/b
    
    def modulo(self, dividendo,  divisor):
        return dividendo%divisor
    
    def raiz_cuadrada(self, a):
        return math.sqrt(a)
    
    def logaritmo(self, a,  b):
        return "No implementado"
    
    def es_primo(self, a):
        res=True

        for i in range(2, int((a/2)+1)):
            if(a%i==0):
                res=False

        return res
    
    
        
    def potencia(self, base,  exp):
        return base**exp
    
    def factorial(self, a):
        res=1
        for i in range(1, a+1):
            res*=i
            
        return res
        

    def suma_matricial(self, a,  b):
        res=[[0 for j in range(len(a[0]))] for i in range(len(a))]
        
        for i in range(len(a)):
            for j in range(len(a[0])):
                res[i][j]=a[i][j]+b[i][j]
        
        return res
        
        
        
    def resta_matricial(self, a,  b):
        return False
        
'''
    def mult_matricial(self, a,  b):
    def traspuesta(self, a):
    def determinante_matriz(self, a):
    def resolver_ecuaciones(self, cadena,  eq):
    def multiples_comandos(self, cadena):
'''

if __name__ == "__main__":
    handler = CalculadoraHandler()
    processor = Calculadora.Processor(handler)
    transport = TSocket.TServerSocket(host="127.0.0.1", port=9090)
    tfactory = TTransport.TBufferedTransportFactory()
    pfactory = TBinaryProtocol.TBinaryProtocolFactory()

    server = TServer.TSimpleServer(processor, transport, tfactory, pfactory)

    print("iniciando servidor...")
    server.serve()
    print("fin")
