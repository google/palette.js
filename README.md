Colour Palette Generator
========================

The palette.js script allows to generate palette colours and was
intended for use with graphs, charts and cartography.  In default
setup, it contains [Paul Tol's](http://www.sron.nl/~pault) and
[ColorBrewer](http://colorbrewer2.org/) palettes specifically designed
for that purpose.  The library includes several qualitative,
sequential and diverging colour schemes

Some of the included palettes have a limited number of colours, but
others use a colour generation functions and can potentially create
a whole spectrum of colours.

There is [an interactive demo of the
library](http://google.github.io/palette.js/) if you wish to see what
it can do.

Naming
------

The basic two concepts in palette.js library are schemes and palettes.
It is important to understand what they are so as to understand the
API of the library.

A *palette* is a sequence of colours and it is represented by an array
of colours encoded as “RRGGBB” strings.  Palette has a fixed size or
number of colours in it. For example, the following code defines
a 8-colour palette which is a sequence of base colours of the
[Solarized](http://ethanschoonover.com/solarized) palette:

    var sol_base = ['002b36', '073642', '586e75', '657b83',
                    '839496', '93a1a1', 'eee8d5', 'fdf6e3'];

A *scheme* is a set of colour palettes and it is represented by
a function with some additional properties and methods (i.e. it can be
used as an object).  In simplest cases, scheme will be used to
generate a palette of desired size.  For example, if `hsv_rainbow` is
an HSV rainbow scheme, the following code generates a 6-colour palette
based on the scheme:

    var hsv6 = hsv_rainbow(6);

Library quick start
-------------------

The simplest way to access the library is by calling `palette`
function.  It takes two required arguments: A name of a colour scheme
and size of the palette.  For example to generate a 10-colour palette
one would invoke:

    var seq = palette('tol-sq', 10);

`tol-sq` is a name for Paul Tol's sequential scheme.  In addition to
names of schemes the function can also take group names or a list of
palette names.  For example:

    var seq = palette('sequential', 10);
    var cbf = palette('sequential-cbf', 10);

will take the first available sequential colour scheme and generate
10-colour palette storing it in `seq`.  The second line does the same
except it limits the palettes to only those that are colour blind
friendly.

The argument can also be a list of colour schemes as in:

    var div = palette(['tol', 'qualitative'], 10);

Here, `div` will be assigned an array of colours from Paul Tol's
qualitative scheme unless it is not available in which case the first
available qualitative colour scheme will be used.

Another use of a list of schemes or group names is a third optional
argument to the `palette` function -- the index for the scheme to use.
When specified, not the first one, but the given scheme will be used
(indexed from zero).  This can be used to generate distinct colour
palettes for various types of data.

    var pal_for_queries = palette(['sequential'], 10, 0);
    var pal_for_errors = palette(['sequential'], 10, 1);
    var pal_for_latency = palette(['sequential'], 10, 2);

With the above code, three separate 10-colour palettes will be
generated each for different kind of data.

If no schemes matched specified name(s), `palette` function will
return `null`.

For a full reference please see the source code.

Note on colour blindness
------------------------

A palette can be colour blind friendly, or CBF, meaning that colours
in it are distinguishable by a colour blind person.  Scheme can also
be colour blind friendly (for example all Paul Tol's schemes are), but
more often only some of the palettes in given scheme are (for example
a 4-colour palette based on ColorBrewer Paired scheme is CBF, but
bigger palettes aren't).

[The demo page](http://google.github.io/palette.js/) contains code for
colour blindness simulation mode.
